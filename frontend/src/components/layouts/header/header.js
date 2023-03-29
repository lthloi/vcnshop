import React from "react"
import { styled } from '@mui/material/styles'
import Notice from './notice/notice'
import Navigation from './navigation/navigation'
import BreadcrumbBase from './breadcrumb_base'

const Header = () => {
    return (
        <HeaderArea id="HeaderArea">
            <Notice />
            <Navigation />
            <BreadcrumbBase />
        </HeaderArea>
    )
}

export default Header

const HeaderArea = styled('div')(({ theme }) => ({
    
}))