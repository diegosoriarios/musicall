import styled from 'styled-components';

import { customColors } from '../../assets/colors'

export const LoginContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    width: 100%;
    height: 100vh;
    background: ${customColors.black};
    margin: 0;
`

export const LoginImage = styled.img`
    height: 25px;
`

export const LoginBackground = styled.img`
    height: 50vh;
`;

export const LoginLogo = styled.img`
    width: 10vw;
    top: 15%;
`

export const LoginText = styled.h4`
    height: 25px;
    margin: 0;
    color: ${customColors.green};
    text-decoration: none;
    line-height: 25px;
`

export const LoginTitle = styled.h1`
    color: white;
    position: absolute;
    top: 15%;
`

export const LoginButton = styled.button`
    display: flex;
    align-items: center;
    justify-content: space-around;
    background-color: ${customColors.black};
    width: 250px;
    height: 50px;
    border-radius: 100px;
    color: white;
    outline: none;
    border: none;
`

export const PlayerContainer = styled.div`
    height: 40vh;
    background-color: ${customColors.black};
    background-image: url(${props => props.backgroundImage});
    background-repeat: no-repeat;
    background-size: cover;
    background-position-y: -300px;
    width: 100%;
    align-items: center;
    justify-content: center;
    display: flex;
    flex-direction: column;
    margin-top: 70px;
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
    background-color: ${customColors.green};
    width: 150px;
    height: 25px;
    border-radius: 100px;
    color: white;
    margin-top: 3%;
    outline: none;
    border: none;
`

export const SimilarContainer = styled.div`
    height: 20vh;
    background-color: ${customColors.green};
    width: 100%;
    align-items: center;
    justify-content: center;
    display: flex;
    flex-direction: column;
    border-top: 50px solid ${customColors.green};
    margin-top: -50px;
`