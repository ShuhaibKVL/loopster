import * as yup from 'yup'

export const signUpSchema = yup.object().shape({
    fullName:yup
            .string()
            .matches(/^[A-Za-z]+$/,"Full name should only contain alphabets")
            .required('Full name is required'),

    userName:yup
            .string()
            .matches(/^[A-Za-z0-9_-]+$/,'User name only contain alphabets,numbers,dashes,and underscores')
            .required('Username is required'),

    email:yup
            .string()
            .email('Enter a valid email')
            .required('Email is required'),

    password:yup
            .string()
            .min(8,'Password must be at least 8 characters')
            .matches(/[a-z]/,'Password must contain at least one lowercase letter')
            .matches(/[A_Z]/,'Password must contain at least one uppercase letter')
            .matches(/\d/,'Password must contain at least one number')
            .matches(/[!@#$%^&*]/,'Password must contain at least one special character')
            .required('Password is required'),

    confirmPassword:yup
            .string()
            .oneOf([yup.ref('password')],'Password do not match')
            .required('Confirm Password is required'),
})

export const signInSchema = yup.object().shape({
    email:yup
            .string()
            .email('Enter a valid email')
            .required('Email is required'),

    password:yup
            .string()
            .required('Password is required')
})

export const editProfileSchema = yup.object().shape({
        fullName:yup
                .string()
                .matches(/^[A-Za-z]+$/,"Full name should only contain alphabets")
                .required('Full name is required'),
    
        userName:yup
                .string()
                .matches(/^[A-Za-z0-9_-]+$/,'User name only contain alphabets,numbers,dashes,and underscores')
                .required('Username is required'),
    
        email:yup
                .string()
                .email('Enter a valid email')
                .required('Email is required'),
    
    })

