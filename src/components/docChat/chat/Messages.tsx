"use client";

import { trpc } from "@/app/_trpc/client";
import { Skeleton } from "@/components/ui/skeleton";
import { DEFAULT_INFINITE_QUERY_LIMIT } from "@/config/infinite-query";
import { Loader2, MessageSquare } from "lucide-react";
import { Message } from "@/components/docChat/chat/Message";
import { useContext } from "react";
import { ChatContext } from "@/context/ChatContext";

type MessagesProps = {
  fileId: string;
};

export const Messages = ({ fileId }: MessagesProps) => {
  const { isLoading: isAiThinking } = useContext(ChatContext);

  const { data, isLoading, fetchNextPage } =
    trpc.getFileMessages.useInfiniteQuery(
      { fileId, limit: DEFAULT_INFINITE_QUERY_LIMIT },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        keepPreviousData: true,
      }
    );

  const messages = data?.pages.flatMap((page) => page.messages);

  const loadingMessage = {
    id: "loading-message",
    createdAt: new Date().toISOString(),
    text: (
      <span className="flex h-full items-center justify-center">
        <Loader2 className="w-4 h-4 animate-spin" />
      </span>
    ),
    isUserMessage: false,
  };

  const combinedMessages = [
    ...(isAiThinking ? [loadingMessage] : []),
    ...(messages ?? []),
  ];

  return (
    <div className="flex max-h-[calc(100vh-3.5rem-7rem)] border-zinc-200 flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-violet scrollbar-thumb-rounded scrollbar-track-violet-lighter scrollbar-w-2 scrolling touch">
      {combinedMessages && combinedMessages.length > 0 ? (
        combinedMessages.map((message, index) => {
          const isNextMessageSamePerson =
            combinedMessages[index - 1]?.isUserMessage ===
            combinedMessages[index]?.isUserMessage;

          if (index === combinedMessages.length - 1) {
            return (
              <Message
                key={message.id}
                isNextMessageSamePerson={isNextMessageSamePerson}
                message={message}
              />
            );
          }
          return (
            <Message
              key={message.id}
              isNextMessageSamePerson={isNextMessageSamePerson}
              message={message}
            />
          );
        })
      ) : isLoading ? (
        <div className="w-full flex flex-col gap-2">
          <p>Skeleton loaders go here</p>
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
          <Skeleton className="h-16" />
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center gap-2">
          <MessageSquare className="w-8 h-8 text-primary" />
          <p className="font-semibold text-xl">You&apos;re all set!</p>
          <p className="text-zinc-500 text-sm">
            Ask your first question to get started.
          </p>
        </div>
      )}
    </div>
  );
};
