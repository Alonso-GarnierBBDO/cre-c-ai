import {SVGProps} from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number;
};

export type GPTRules = {
  role: string,
  content: string
}

export type PropsTypes = {

  gemini: {
      titulo: string,
      description: string,
      startHistory: string,
      continueHistory: string
  };
  gpt: {
      titulo: {
        rules: GPTRules[];
      },
      description: {
        rules: GPTRules[];
      },
      startHistory: {
        rules: GPTRules[];
      },
      continueHistory: {
        rules: GPTRules[];
      }
  };
}