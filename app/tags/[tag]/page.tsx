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
      {/* scale.h3: 28px / 36px / semibold */}
      <h1 className="font-sans text-[28px] leading-[36px] font-semibold text-ink mt-4 mb-8">
        #{params.tag}
      </h1>
      <PostList articles={articles} />
    </div>
  );
}
