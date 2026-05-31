import "./index.css";
import { Composition } from "remotion";
import { PromptBox } from "./PromptBox";
import { BudgetBuilder } from "./BudgetBuilder";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="PromptBox"
        component={PromptBox}
        durationInFrames={180}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="BudgetBuilder"
        component={BudgetBuilder}
        durationInFrames={170}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
