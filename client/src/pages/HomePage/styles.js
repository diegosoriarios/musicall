import styled from 'styled-components';

export const LoginContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100vh;
    margin: 0;
    background-color: #ccc;
`

export const LoginButton = styled.button`
    background-color: #0f0;
    width: 250px;
    height: 50px;
    border-radius: 100px;
    color: white;
`

export const PlayerContainer = styled.div`
    height: 40vh;
    background-color: black;
    width: 100%;
    align-items: center;
    justify-content: center;
    display: flex;
    flex-direction: column;
    border-bottom-left-radius: 50px;
    z-index: 2;
`

export const MusicImage = styled.img`
    width: 75px;
    height: 75px;
    border-radius: 50%;
`

export const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100vh;
    margin: 0;
    background-color: #ccc;
`

export const MusicTitle = styled.h1`
    color: white;
    margin-bottom: 3%;
    font-size: 18px;
`

export const MusicButton = styled.button`
    background-color: #0f0;
    width: 150px;
    height: 25px;
    border-radius: 100px;
    color: white;
    margin-top: 3%;
`

export const SimilarContainer = styled.div`
    height: 20vh;
    background-color: lightblue;
    width: 100%;
    align-items: center;
    justify-content: center;
    display: flex;
    flex-direction: column;
    border-top: 50px solid lightblue;
    margin-top: -50px;
    border-bottom-left-radius: 50px;
`