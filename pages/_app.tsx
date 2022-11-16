import '../styles/globals.scss'
import type { AppProps } from 'next/app'
import Layout from '../components/Layout'
import { homePageMeta } from '../data';

export default function App({ Component, pageProps }: AppProps) {
  const { title, description } = homePageMeta;

  return (
    <Layout description={description} title={title}>
      <Component {...pageProps} />
    </Layout>
  )
}
