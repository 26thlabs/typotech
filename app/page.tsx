import { getAllTags } from "@/lib/articles";
import { TagPills } from "@/components/tag-pills";
import { site } from "@/lib/site";

export default async function Home() {
  const allTags = await getAllTags();

  return (
    <div className="flex-grow flex flex-col justify-center gap-8">
      {/* Banner */}
      <img
        src={site.banner}
        alt=""
        className="w-full rounded-lg"
        loading="eager"
      />

      {/* 站点简介 — scale.body: 18px / 32px */}
      <p className="landing">
        {site.intro}
      </p>

      {/* 标签入口 */}
      {allTags.length > 0 && (
        <div>
          <p className="text-[14px] leading-[24px] text-ink-tertiary font-sans font-medium tracking-[0.01em] mb-3">
            #文章标签
          </p>
          <TagPills tags={allTags.map((t) => t.tag)} link />
        </div>
      )}
    </div>
  );
}
