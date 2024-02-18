import { getDictionary } from "get-dictionary";
import { type Locale } from "i18n-config";

export default async function Index({
  params: { lang },
}: {
  params: { lang: Locale };
}) {
  const dictionary = getDictionary(lang);
  const now = new Date().getHours();
  let greetings = dictionary.ui.index.goodMorning;
  if (now >= 13 && now < 18) {
    greetings = dictionary.ui.index.goodAfternoon;
  } else if ((now >= 18 && now < 24) || now < 5) {
    greetings = dictionary.ui.index.goodEvening;
  }
  return (
    <div className="Index flex flex-1 flex-col overflow-x-hidden">
    <div className="jumbo$ fixed top-0 left-0 w-dvw h-dvh -z-50 opacity-50"></div>
      <div className="Top flex flex-1 flex-col justify-center items-center">
        <h1 className="Title text-center text-5xl p-10 mx-8 font-extrabold tracking-tight lg:text-9xl border-b-2 border-bg-white-30 -translate-y-1/3">
          Toram <span className=" text-brand-color-1st">の</span>{" "}
          Calculactor
        </h1>
        <span className=" hidden text-center">{greetings}</span>
      </div>
      <div className="Bottom flex flex-initial flex-col">
        <div className="Content flex flex-1 flex-col p-5">
        </div>
      </div>
    </div>
  );
}
