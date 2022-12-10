import Link from 'next/link'
import Head from 'next/head'
import { GetStaticProps } from 'next'
import { useSession } from 'next-auth/react'
import { getPrismicClient } from '../../services/prismic'
import styles from './styles.module.scss'
import * as Prismic from '@prismicio/client'
import { RichText } from 'prismic-dom'

type Post = {
  slug: string
  title: string
  excerpt: string
  updatedAt: string
}

interface PostsProps {
  posts: Post[]
}

export default function Posts({ posts }: PostsProps) {
  const { data: session } = useSession()

  return (
    <>
      <Head>
        <title>Posts | Ignews</title>
      </Head>

      <main className={styles.container}>
        <div className={styles.posts}>
          { posts.map(post => (
            <Link
              key={post.slug}
              href={session?.activeSubscription
                ? `/posts/${post.slug}`
                : `/posts/preview/${post.slug}`
              }
            >
              <a >
                <time>{post.updatedAt}</time>
                <strong>{post.title}</strong>
                <p>{post.excerpt}</p>
              </a>
            </Link>
          ))}
        </div>
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient()

  const response = await prismic.get({
    predicates: Prismic.predicate.at('document.type', 'post'),
    fetch: ['post.title', 'post.content'],
    pageSize: 100
  })

  const posts = response.results.map(post => {
    return {
      slug: post.uid,
      title: RichText.asText(post.data.title),
      excerpt: post.data.content.find(content => content.type === 'paragraph')?.text ?? '',
      updatedAt: new Date(post.last_publication_date).toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'long',
        year: 'numeric'
      })
    }
  })

  return {
    props: {
      posts
    }
  }
}