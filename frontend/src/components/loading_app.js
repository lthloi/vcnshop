import React from "react"
import { styled } from '@mui/material/styles'
import LogoApp from '../assets/images/logo_app.svg'
import { useSelector } from "react-redux"

const LoadingApp = () => {
    const { loading: addToCartLoading } = useSelector(({ cart }) => cart)
    const { newReviewProcessing } = useSelector(({ productDetail }) => productDetail)

    if (
        addToCartLoading || newReviewProcessing
    ) {
        return (
            <LoadingAppModalBase id="LoadingApp">
                <ImageAnimationContainer>

                    <CircularAnimation />

                    <ImageAnimation src={LogoApp} />

                </ImageAnimationContainer>
            </LoadingAppModalBase>
        )
    }
}

export default LoadingApp

const LoadingAppModalBase = styled('div')(({ theme }) => ({
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'fixed',
    top: '0',
    bottom: '0',
    right: '0',
    left: '0',
    zIndex: '100',
    backgroundColor: 'rgba(0,0,0,0.7)',
}))

const ImageAnimationContainer = styled('div')({
    padding: '30px',
    border: '5px transparent solid',
    position: 'relative',
    borderRadius: '50%',
    width: '85px',
    height: '85px',
})

const CircularAnimation = styled('div')({
    position: 'absolute',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    borderTop: '5px white solid',
    boxSizing: 'border-box',
    borderRadius: '50%',
    animation: 'circular-animation 2s infinite',
    '@keyframes circular-animation': {
        '0%': {
            transform: 'rotate(0deg)',
        },
        '25%': {
            transform: 'rotate(90deg)',
        },
        '50%': {
            transform: 'rotate(180deg)',
        },
        '75%': {
            transform: 'rotate(270deg)',
        },
        '100%': {
            transform: 'rotate(360deg)',
        },
    }
})

const ImageAnimation = styled('img')({
    width: '100%',
    height: '100%',
})