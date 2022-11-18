import { type AppType } from "next/dist/shared/lib/utils";
import type { AppProps } from "next/app";
import { ReactNode } from "react";
import { NextPage } from "next";
import Layout from '../components/Layout'
import { homePageMeta } from '../data';

import "../styles/globals.scss";


type Page<P = {}> = NextPage<P> & {
  getLayout?: (page: ReactNode) => ReactNode;
};

type Props = AppProps & {
  Component: Page;
}

const MyApp = ({ Component, pageProps }: Props) => {
  const { title, description } = homePageMeta;
  const renderWithLayout =
    Component.getLayout ||
    function (page) {
      return <Layout description={description} title={title}>{page}</Layout>;
    };

  return renderWithLayout(
    <Component {...pageProps} />
  )
};

export default MyApp;
