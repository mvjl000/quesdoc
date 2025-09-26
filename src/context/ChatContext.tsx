import { trpc } from "@/app/_trpc/client";
import { useToast } from "@/components/ui/use-toast";
import { DEFAULT_INFINITE_QUERY_LIMIT } from "@/config/infinite-query";
import { useMutation } from "@tanstack/react-query";
import { ChangeEvent, ReactNode, createContext, useRef, useState } from "react";

type ChatContextType = {
    addMessage: () => void;
    message: string;
    handleInputChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
    isLoading: boolean;
};

export const ChatContext = createContext<ChatContextType>({
    addMessage: () => {},
    message: "",
    handleInputChange: () => {},
    isLoading: false,
});

type ChatContextProviderProps = {
    fileId: string;
    children: ReactNode;
};

export const ChatContextProvider = ({
    fileId,
    children,
}: ChatContextProviderProps) => {
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const utils = trpc.useContext();

    const { toast } = useToast();

    const backupMessage = useRef("");

    const { mutate: sendMessage } = useMutation({
        mutationFn: async ({ message }: { message: string }) => {
            const response = await fetch("/api/message", {
                method: "POST",
                body: JSON.stringify({
                    fileId,
                    message,
                }),
            });
            if (!response.ok) {
                throw new Error("Failed to send message");
            }

            console.log("RESPONSE>>>>>>", await response.json());
            return response.body;
        },
        onMutate: async ({ message }) => {
            backupMessage.current = message;
            setMessage("");

            await utils.getFileMessages.cancel();

            const previousMessages = utils.getFileMessages.getInfiniteData();

            utils.getFileMessages.setInfiniteData(
                {
                    fileId,
                    limit: DEFAULT_INFINITE_QUERY_LIMIT,
                },
                (oldData) => {
                    if (!oldData)
                        return {
                            pages: [],
                            pageParams: [],
                        };

                    let newPages = [...oldData.pages];

                    let latestPage = newPages[0]!;

                    latestPage.messages = [
                        {
                            id: crypto.randomUUID(),
                            createdAt: new Date().toISOString(),
                            text: message,
                            isUserMessage: true,
                        },
                        ...latestPage.messages,
                    ];

                    newPages[0] = latestPage;

                    return {
                        ...oldData,
                        pages: newPages,
                    };
                }
            );

            setIsLoading(true);

            return {
                previosMessages:
                    previousMessages?.pages.flatMap((page) => page.messages) ??
                    [],
            };
        },
        onSuccess: async (stream) => {
            setIsLoading(false);

            if (!stream)
                return toast({
                    title: "There was a problem sending this message",
                    description: "Please refresh this page and try again",
                    variant: "destructive",
                });

            const reader = stream.getReader();
            const decoder = new TextDecoder();
            let done = false;

            let accumulatedResponse = "";

            while (!done) {
                const { value, done: doneReading } = await reader.read();
                done = doneReading;

                const chunkValue = decoder.decode(value);

                accumulatedResponse += chunkValue;

                utils.getFileMessages.setInfiniteData(
                    { fileId, limit: DEFAULT_INFINITE_QUERY_LIMIT },
                    (oldData) => {
                        if (!oldData) return { pages: [], pageParams: [] };

                        let isAiResponseCreated = oldData.pages.some((page) =>
                            page.messages.some(
                                (message) => message.id === "ai-response"
                            )
                        );

                        let updatedPages = oldData.pages.map((page) => {
                            if (page === oldData.pages[0]) {
                                let updatedMessages;

                                if (!isAiResponseCreated) {
                                    updatedMessages = [
                                        {
                                            id: "ai-response",
                                            createdAt: new Date().toISOString(),
                                            text: accumulatedResponse,
                                            isUserMessage: false,
                                        },
                                        ...page.messages,
                                    ];
                                } else {
                                    updatedMessages = page.messages.map(
                                        (message) => {
                                            if (message.id === "ai-response") {
                                                return {
                                                    ...message,
                                                    text: accumulatedResponse,
                                                };
                                            }
                                            return message;
                                        }
                                    );
                                }

                                return {
                                    ...page,
                                    messages: updatedMessages,
                                };
                            }

                            return page;
                        });

                        return { ...oldData, pages: updatedPages };
                    }
                );
            }
        },
        onError: (_, __, context) => {
            setMessage(backupMessage.current);
            utils.getFileMessages.setData(
                {
                    fileId,
                },
                {
                    messages: context?.previosMessages ?? [],
                }
            );
        },
        onSettled: async () => {
            setIsLoading(false);

            await utils.getFileMessages.invalidate({ fileId });
        },
    });

    const addMessage = () => sendMessage({ message });

    const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(event.target.value);
    };

    const contextValues: ChatContextType = {
        addMessage,
        message,
        handleInputChange,
        isLoading,
    };

    return (
        <ChatContext.Provider value={contextValues}>
            {children}
        </ChatContext.Provider>
    );
};
