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
            <div className={layoutStyles.warp_container}>
                <Head>
                    <title>{title}</title>
                    <meta content={description} name="description" />
                </Head>
                <Header />
                <main className={layoutStyles.main_container}>{children}</main>
                <Footer />
            </div>
        </div>
    );
});

Layout.displayName = 'Layout';
export default Layout;
