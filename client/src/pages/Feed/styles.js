import styled from 'styled-components'

export const Post = styled.div`
    width: 96%;
    margin: 1%;
    background-color: white;
    display: flex;
    flex-direction: column;
    position: relative;
`

export const FeedHeader = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-top: 2%;
`

export const Avatar = styled.img`
    margin-left: 25px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
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

export const NewPostBox = styled.div`
    width: 96%;
    margin: 0 auto;
    background-color: #aaa;
    border-radius: 15px;
    margin: 2%;
    padding: 2% 0;
    display: flex;
    flex-direction: column;
`

export const NewPostBoxTop = styled.div`
    flex-direction: row;
    display: flex;
`

export const NewPostBoxBottom = styled.div`
    flex-direction: row-reverse;
    display: flex;
`

export const NewPostInput = styled.input`
    margin: 0 2%;
    min-width: 75%;
`