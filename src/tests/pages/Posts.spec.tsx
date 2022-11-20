import { render, screen } from '@testing-library/react'
import { mocked } from 'jest-mock'
import { getPrismicClient } from '../../services/prismic'
import Posts, { getStaticProps } from '../../pages/posts'

const posts = [{
  slug: 'my-new-post',
  title: 'My New Post',
  excerpt: 'Post excerpt',
  updatedAt: 'March 06, 2022'
}]

jest.mock('../../services/prismic')

describe('Posts page', () => {
  it('renders correctly', () => {
    render(<Posts posts={posts} />)

    expect(screen.getByText('My New Post')).toBeInTheDocument()
  })

  it('loads initial data', async () => {
    const getPrismicClientMocked = mocked(getPrismicClient)

    getPrismicClientMocked.mockReturnValueOnce({
      get: jest.fn().mockResolvedValueOnce({
        results: [{
          uid: 'my-new-post',
          data: {
            title: [{ type: 'heading', text: 'My New Post'}],
            content: [{ type: 'paragraph', text: 'Post excerpt' }]
          },
          last_publication_date: '03-06-2022'
        }]
      })
    } as any)

    const response = await getStaticProps({})

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          posts: [{
            slug: 'my-new-post',
            title: 'My New Post',
            excerpt: 'Post excerpt',
            updatedAt: 'March 06, 2022'
          }]
        }
      })
    )
  })
})
