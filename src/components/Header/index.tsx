import { FC, memo } from 'react';
import headerStyles from './index.module.scss';
import Link from 'next/link'

const Header: FC = memo(() => {
    return (
        <div className={`${headerStyles.header}`}>
            <div className={`${headerStyles.logo_title}`}>
                <Link href="/">vStudio</Link>
            </div>
            <button className={`${headerStyles.nav_btn}`}>Sign in</button>
        </div>
    );
});

Header.displayName = 'Header';
export default Header;