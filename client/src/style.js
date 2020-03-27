import styled from 'styled-components'
import { customColors } from './assets/colors';

export const Navbar = styled.ul`
    margin: 0;
    bottom: 0;
    left: 0;
    position: fixed;
    display: ${props => props.display};
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    width: 50px;
    padding: 0;
    background-color: #eee;
    height: 100vh;
    max-height: 100vh;
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
`