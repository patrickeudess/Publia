import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { Loading } from './components/Loading'
import { useAuth } from './hooks/useAuth'
import { DashboardLayout } from './layouts/DashboardLayout'
import { PublicLayout } from './layouts/PublicLayout'
import { AuthPage } from './pages/AuthPage'
import { DashboardPage } from './pages/DashboardPage'
import { ForgotPasswordPage } from './pages/ForgotPasswordPage'
import { HomePage } from './pages/HomePage'
import { ProjectFormPage } from './pages/ProjectFormPage'
import { PublicProjectPage } from './pages/PublicProjectPage'
import { ResetPasswordPage } from './pages/ResetPasswordPage'

function ProtectedRoute(){const{user,loading}=useAuth();if(loading)return <Loading/>;return user?<Outlet/>:<Navigate to="/connexion" replace/>}
export default function App(){return <Routes><Route element={<PublicLayout/>}><Route index element={<HomePage/>}/></Route><Route path="/connexion" element={<AuthPage mode="login"/>}/><Route path="/inscription" element={<AuthPage mode="signup"/>}/><Route path="/mot-de-passe-oublie" element={<ForgotPasswordPage/>}/><Route path="/reinitialiser-mot-de-passe" element={<ResetPasswordPage/>}/><Route path="/p/:slug" element={<PublicProjectPage/>}/><Route element={<ProtectedRoute/>}><Route element={<DashboardLayout/>}><Route path="/dashboard" element={<DashboardPage/>}/><Route path="/projets/nouveau" element={<ProjectFormPage/>}/><Route path="/projets/:id/modifier" element={<ProjectFormPage/>}/></Route></Route><Route path="*" element={<Navigate to="/" replace/>}/></Routes>}