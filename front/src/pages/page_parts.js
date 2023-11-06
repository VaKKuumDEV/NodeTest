import { useEffect } from "react";
import { Nav, NavLink, NavMenu } from "../styles/navbar";
import Cookies from 'universal-cookie';

const GetNavlinks = (authed = false) => {
    if (authed) {
        return (
            <>
                <NavLink to="/news" activeStyle>
                    News
                </NavLink>
                <NavLink to="/news/add" activeStyle>
                    Add new
                </NavLink>
                <NavLink to="/news/my" activeStyle>
                    My news
                </NavLink>
            </>
        );
    }

    return (
        <>
            <NavLink to="/news" activeStyle>
                News
            </NavLink>
            <NavLink to="/login" activeStyle>
                Login
            </NavLink>
            <NavLink to="/register" activeStyle>
                Register
            </NavLink>
        </>
    );
};

const Header = () => {
    const cookies = new Cookies();

    useEffect(() => {

    });

    return (
        <>
            <Nav>
                <NavMenu>
                    {GetNavlinks(cookies.get('token') !== undefined)}
                </NavMenu>
            </Nav>
        </>
    );
}

export default Header;