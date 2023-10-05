import { RouterOutput } from "@/types/trpc";

type Messages = RouterOutput["getFileMessages"]["messages"];

type Message = Messages[number];

type OmitText = Omit<Message, "text">;

type ExtendedText = {
  text: string | JSX.Element;
};

export type ExtendedMessage = OmitText & ExtendedText;
