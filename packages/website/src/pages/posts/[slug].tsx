import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { Post } from '..';
import { DivaLogo } from '../../components/DivaLogo';
import { format, parseISO } from 'date-fns';
import Tweet from 'react-tweet-embed'
import { IMAGE_PATH } from '../../constants';
// @ts-ignore
import { getAllPosts, getPostBySlug } from '../api/getPosts';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { GetStaticProps } from 'next';
import { serialize } from 'next-mdx-remote/serialize';
import { useEffect, useState } from 'react';
import { RandomVerticalSvgLine } from '../../components/RandomVerticalSvgLine';

export async function getStaticPaths() {
  const posts = getAllPosts()
  return {
    paths: posts.map((v) => ({
      params: { slug: v.slug },
    })),
    fallback: false,
  };
}

type PostPageProps = {
  source: MDXRemoteSerializeResult;
  post: Post;
};

const components = {
  Tweet,
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const post = getPostBySlug(params?.slug as string);

  const mdxSource = await serialize(post.content, {
    // Optionally pass remark/rehype plugins
    mdxOptions: {},
    scope: {
      ...post,
      date: (post.date as unknown as Date).toISOString(),
    },
  });

  return {
    props: {
      source: mdxSource,
      post: {
        ...post,
        date: (post.date as unknown as Date).toISOString(),
      },
    },
  };
};

const PostPage = ({ source, post }: PostPageProps) => {

  return (
    <>
      <Head>
        <title>Diva Protocol - {post.title}</title>
        <meta name="description" content={post.title} />
        <meta name="og:description" content={post.title} />
        <meta name="og:image" content={post.coverImage} />
        <link rel="icon" href="/logo.svg" />
        <meta name="og:title" content={post.title} />
      </Head>
      <nav className="p-5 pl-10 pt-8">
        <Link href="/" passHref>
          <a className="inline-block">
            <DivaLogo className="fill-text stroke-text h-7" />
          </a>
        </Link>
      </nav>
      <article className="pb-12 relative">
        <Image
          src={`${IMAGE_PATH}${post.coverImage}`}
          alt={post.coverImageDescription}
          width={post.coverImageWidth}
          height={post.coverImageHeight}
          layout="responsive"
        />
        <div className="pt-12 prose max-w-2xl m-auto prose-slate px-10">
          <h1>{post.title}</h1>
          <p className="text-slate">
            By <strong>{post.author}</strong> at{" "}
            <time>{format(parseISO(post.date), "MMMM dd, yyyy")}</time>
          </p>
          <MDXRemote {...source} components={components} />
        </div>
      </article>
    </>
  );
};

export default PostPage