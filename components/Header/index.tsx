import { FC, memo } from 'react';
import headerStyles from './index.module.scss';

const Header: FC = memo(() => {
    return (
        <div className={`${headerStyles.header}`}>
            <div className={`${headerStyles.logo_title}`}>vStudio</div>
            <button className={`${headerStyles.nav_btn}`}>Sign in</button>
        </div>
    );
});

Header.displayName = 'Header';
export default Header;