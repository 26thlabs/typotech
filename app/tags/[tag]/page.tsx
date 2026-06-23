import { getAllArticles, getAllTags } from "@/lib/articles";
import { PostList } from "@/components/post-list";
import { BackLink } from "@/components/back-link";

export async function generateStaticParams() {
  const tags = await getAllTags();
  return tags.map((t) => ({ tag: t.tag }));
}

export async function generateMetadata(props: {
  params: Promise<{ tag: string }>;
}) {
  const params = await props.params;
  return { title: `#${decodeURIComponent(params.tag)}` };
}

export default async function Page(props: {
  params: Promise<{ tag: string }>;
}) {
  const params = await props.params;
  const tag = decodeURIComponent(params.tag);
  const articles = (await getAllArticles()).filter((a) =>
    a.tags?.includes(tag)
  );

  return (
    <div>
      <BackLink href="/" label="← Home" />
      {/* h3 — mobile: 20px/28px, desktop: 28px/36px */}
      <h1 className="font-sans text-[20px] leading-[28px] sm:text-[28px] sm:leading-[36px] font-semibold text-ink mt-4 mb-8">
        #{params.tag}
      </h1>
      <PostList articles={articles} />
    </div>
  );
}
