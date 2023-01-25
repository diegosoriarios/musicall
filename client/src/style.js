import styled from 'styled-components'
import { customColors } from './assets/colors';

export const Navbar = styled.ul`
    position: fixed;
    width: 100vw;
    min-height: 70px;
    margin: 0;
    display: ${props => props.display};
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding: 0;
    background-color: ${customColors.black};
    z-index: 5;
    @media only screen and (max-width: 600px) {
        margin: 0;
        bottom: 0;
        left: 0;
        position: fixed;
        display: ${props => props.display};
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
        width: 100%;
        padding: 0;
        background-color: #eee;
        height: 50px;
        z-index: 5;
    }
`

export const NavbarItem = styled.li`
    list-style: none;
    color: ${customColors.black};
    text-transform: uppercase;
    margin-left: 20px;
    margin-right: 20px;
`

export const LinkText = styled.p`
    color: ${customColors.white};
    border-bottom: ${props => props.selected ? `3px solid ${customColors.white}` : "none" };
    &:hover {
        color: ${customColors.green};
    }
`;

export const IconImage = styled.img`
    width: 50px;
    height: 50px;
`;

export const HeaderText = styled.p`
    margin-left: 50px;
    color: ${customColors.white};
    text-transform: uppercase;
`;

export const NavbarIcons = styled.div`
    flex-direction: row;
    display: flex;
`;

export const NavbarHeader = styled.div`
    flex-direction: row;
    display: flex;
    margin-left: 50px;
`;