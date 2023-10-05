import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ChatContext } from "@/context/ChatContext";
import { SendIcon } from "lucide-react";
import { KeyboardEvent, useContext, useRef } from "react";

type ChatInputProps = {
  isDisabled?: boolean;
};

export const ChatInput = ({ isDisabled }: ChatInputProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { addMessage, handleInputChange, isLoading, message } =
    useContext(ChatContext);

  const handleOnSubmit = () => {
    addMessage();

    textareaRef.current?.focus();
  };

  const handleOnKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();

      handleOnSubmit();
    }
  };

  return (
    <div className="absolute bottom-0 left-0 w-full">
      <form className="mx-2 flex flex-row gap-3 md:mx-4 md:last:mb-6 lg:mx-auto lg:max-w-2xl xl:max-w-3xl">
        <div className="relative flex h-full flex-1 items-stretch md:flex-col">
          <div className="relative flex flex-col w-full flex-grow p-4">
            <div className="relative">
              <Textarea
                ref={textareaRef}
                placeholder="Enter your question..."
                rows={1}
                maxRows={4}
                autoFocus={true}
                onChange={handleInputChange}
                onKeyDown={handleOnKeyDown}
                value={message}
                className="resize-none pr-12 text-base py-3 scrollbar-thumb-violet scrollbar-thumb-rounded scrollbar-track-violet-lighter scrollbar-w-2 scrolling-touchr"
              />
              <Button
                type="submit"
                aria-label="send message"
                disabled={isLoading || isDisabled}
                onClick={handleOnSubmit}
                className="absolute bottom-[5px] right-[5px]"
              >
                <SendIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};
