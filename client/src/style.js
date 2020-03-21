import styled from 'styled-components'

export const Navbar = styled.ul`
    margin: 0;
    bottom: 0;
    left: 0;
    position: fixed;
    display: ${props => props.display};
    justify-content: space-around;
    align-items: center;
    width: 100%;
    padding: 0;
    background-color: #eee;
    height: 50px;
`

export const NavbarItem = styled.li`
    list-style: none;
    color: black;
`