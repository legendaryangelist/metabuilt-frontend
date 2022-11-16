import { FC, memo } from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import Header from '../Header';
import Footer from '../Footer';
import { HomepageMeta } from '../../data/interfaces';
import layoutStyles from './index.module.scss';

const Layout: NextPage<HomepageMeta | any> = memo(({ children, title, description }) => {

    return (
        <div className={layoutStyles.layout}>
            <Head>
                <title>{title}</title>
                <meta content={description} name="description" />
            </Head>
            <Header />
            <main style={{ width: '100%' }}>{children}</main>
            <Footer />
        </div>
    );
});

Layout.displayName = 'Layout';
export default Layout;
