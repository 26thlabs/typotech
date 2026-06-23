import { getAllTags } from "@/lib/articles";
import { TagPills } from "@/components/tag-pills";
import { site } from "@/lib/site";

export default async function Home() {
  const allTags = await getAllTags();

  return (
    <div className="flex-grow flex flex-col justify-center gap-8">
      {/* Banner — width/height 预设宽高比，避免图片加载时文字抖动 */}
      <img
        src={site.banner}
        alt=""
        width={1440}
        height={480}
        className="w-full h-auto rounded-lg bg-subtle"
        loading="eager"
      />

      {/* 站点简介 */}
      <p className="landing">
        {site.intro}
      </p>

      {/* 标签入口 */}
      {allTags.length > 0 && (
        <div>
          <p className="text-[13px] leading-[20px] sm:text-[14px] sm:leading-[24px] text-ink-tertiary font-sans font-medium tracking-[0.01em] mb-3">
            #文章标签
          </p>
          <TagPills tags={allTags.map((t) => t.tag)} link />
        </div>
      )}
    </div>
  );
}
