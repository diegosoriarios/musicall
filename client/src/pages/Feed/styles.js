import styled from 'styled-components'

export const Post = styled.div`
    width: 96%;
    margin: 1%;
    background-color: white;
    display: flex;
    flex-direction: column;
    position: relative;
`

export const Header = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`

export const Avatar = styled.img`
    margin-left: 25px;
`

export const Username = styled.h1`
    margin: 0;
    margin-left: 25px;
    font-size: 24px;
`

export const Date = styled.h3`
    margin: 0;
    position: absolute;
    font-size: 16px;
    right: 5px;
    top: 5px;
`

export const Content = styled.div`
    width: 90%;
    align-self: center;
    justify-content: center;
    margin-bottom: 5%;
`

export const Likes = styled.div`
    display: flex;
    flex-direction: row;
    align-self: center;
`

export const LikeText = styled.p`
    margin: 0 2%; 
`

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    margin: 0;
    background-color: #ccc;
    align-self: center;
    position: relative;
`

export const CreatePost = styled.button`
    width: 75px;
    height: 75px;
    background-color: #0f0;
    border-radius: 50%;
    position: fixed;
    bottom: 50px;
    right: 10px;
    z-index: 5;
    display: flex;
    justify-content: center;
    align-self: center;
`