import { useNavigate } from 'react-router-dom'
import { useProfil } from '../context/ProfilContext'
import PopupPro from './PopupPro'

export default function ProGate({ children }) {
  const { estPro, chargement } = useProfil()
  const navigate = useNavigate()

  if (chargement) return null
  if (!estPro) return <PopupPro onClose={() => navigate(-1)} />
  return children
}
