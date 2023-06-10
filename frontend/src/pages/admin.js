import React, { useEffect, useState } from "react"
import { styled } from '@mui/material/styles'
import { useDispatch, useSelector } from 'react-redux'
import { getOrdersByAdmin } from "../store/actions/order_actions"
import { getUsersByAdmin } from "../store/actions/user_actions"
import { getProductsByAdmin } from "../store/actions/product_actions"
import List from '@mui/material/List'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import DashboardIcon from '@mui/icons-material/Dashboard'
import Dashboard from "../components/admin/dashboard"
import { Skeleton } from "@mui/material"
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import AllInboxIcon from '@mui/icons-material/AllInbox'
import Products from "../components/admin/products"

const style_for_icons = {
    is_active: {
        color: 'black',
    },
    non_active: {
        color: 'white',
    }
}

const tabs = {
    dashboard: 'Dashboard',
    products: 'Products',
}

const nav_options = [
    {
        label: 'Dashboard',
        icon: (is_active) => <DashboardIcon sx={is_active ? style_for_icons.is_active : style_for_icons.non_active} />,
        href: tabs.dashboard,
    }, {
        label: 'Products',
        icon: (is_active) => <AllInboxIcon sx={is_active ? style_for_icons.is_active : style_for_icons.non_active} />,
        href: tabs.products,
    },
]

const Admin = () => {
    const users = useSelector(({ user }) => user.users)
    const orders = useSelector(({ order }) => order.orders)
    const products = useSelector(({ product }) => product.search.products)
    const dispatch = useDispatch()
    const [button, setButton] = useState(nav_options[0].label)

    useEffect(() => {
        dispatch(getOrdersByAdmin('createdAt', 'payment_status'))
        dispatch(getUsersByAdmin('createdAt', 'active'))
        dispatch(getProductsByAdmin('createdAt', 'stock', 'review.count_review', 'for'))
    }, [dispatch])

    const switchButton = (label_of_button, href) => {
        if (label_of_button === button) return
        setButton(label_of_button)
    }

    return (
        users && users.length > 0 && orders && orders.length > 0 && products && products.length > 0 ?
            <AdminPageSection id="AdminPageSection">
                <PageTitleContainer>
                    <AdminPanelSettingsIcon sx={{ fontSize: '1.8em' }} />
                    <Title>Admin</Title>
                </PageTitleContainer>
                <AdminSection>
                    <StyledList component="div">
                        <ListTitle>
                            {button}
                        </ListTitle>
                        {
                            nav_options.map(({ label, icon, href }) => (
                                <ListItemButtonWrapper
                                    key={label}
                                    sx={button === label ? { backgroundColor: 'white', color: 'black' } : { backgroundColor: 'rgb(53,53,59)' }}
                                >
                                    <StyledListItemButton onClick={() => switchButton(label, href)}>
                                        <ListItemIcon>
                                            {icon(button === label)}
                                        </ListItemIcon>
                                        <ListItemText primary={label} />
                                    </StyledListItemButton>
                                </ListItemButtonWrapper>
                            ))
                        }
                    </StyledList>
                    {
                        button === tabs.dashboard ? (
                            <Dashboard
                                users={users}
                                orders={orders}
                                products={products}
                            />
                        ) : button === tabs.products && (
                            <Products products={products} />
                        )
                    }
                </AdminSection>
            </AdminPageSection>
            :
            <LoadingContainer>
                <StyledSkeleton sx={{ height: '500px', width: '20%' }} />
                <div style={{ width: '80%' }}>
                    <StyledSkeleton sx={{ height: '100px' }} />
                    <StyledSkeleton sx={{ height: '380px', marginTop: '20px' }} />
                </div>
            </LoadingContainer>
    )
}

export default Admin

const AdminPageSection = styled('div')(({ theme }) => ({
    fontFamily: theme.font_family.arial,
    padding: '30px 40px',
}))

const PageTitleContainer = styled('div')({
    display: 'flex',
    alignItems: 'center',
    columnGap: '10px',
    borderBottom: '2px black solid',
    paddingLeft: '10px',
})

const Title = styled('h2')({
    margin: '0',
    fontFamily: 'Kanit, "sans-serif"',
    fontSize: '1.8em',
})

const AdminSection = styled('div')({
    display: 'flex',
    columnGap: '30px',
    marginTop: '30px',
    boxSizing: 'border-box',
})

const ListTitle = styled('h2')({
    margin: '0',
    fontSize: '1.5em',
    fontWeight: 'bold',
    borderBottom: '2px lightgrey solid',
    borderRadius: '10px',
    padding: '15px 0 30px',
    textAlign: 'center',
    marginBottom: '20px',
})

const StyledList = styled(List)({
    width: '25%',
    padding: '30px 20px',
    backgroundColor: 'rgb(53,53,59)',
    color: 'white',
    borderRadius: '5px',
})

const ListItemButtonWrapper = styled('div')({
    marginTop: '10px',
    borderRadius: '5px',
    border: '1px lightgrey solid',
    transition: 'transform 0.2s',
    '&:hover': {
        transform: 'scale(1.1)',
    },
})

const StyledListItemButton = styled(ListItemButton)({
    '& .MuiListItemIcon-root': {
        minWidth: '40px',
    },
})

const LoadingContainer = styled('div')({
    display: 'flex',
    columnGap: '20px',
    width: '100%',
    padding: '0 20px',
    marginTop: '30px',
    boxSizing: 'border-box',
})

const StyledSkeleton = styled(Skeleton)({
    transform: 'none',
    width: '100%',
})