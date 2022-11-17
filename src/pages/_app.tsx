import { type AppType } from "next/dist/shared/lib/utils";
import Layout from '../components/Layout'
import { homePageMeta } from '../data';

import "../styles/globals.scss";

const MyApp: AppType = ({ Component, pageProps }) => {
  const { title, description } = homePageMeta;

  return (
    <Layout description={description} title={title}>
      <Component {...pageProps} />
    </Layout>
  )
};

export default MyApp;
