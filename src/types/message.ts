import { RouterOutput } from "@/types/trpc";
import { ReactElement } from "react";

type Messages = RouterOutput["getFileMessages"]["messages"];

type Message = Messages[number];

type OmitText = Omit<Message, "text">;

type ExtendedText = {
    text: string | ReactElement;
};

export type ExtendedMessage = OmitText & ExtendedText;
