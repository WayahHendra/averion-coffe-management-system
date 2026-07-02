/*
 * Copyright (c) 2026 Averion
 * Email: security@averion.id
 * 
 * PROPRIETARY LICENSE
 * 
 * This software is the confidential and proprietary information of Averion.
 * Unauthorized reproduction, distribution, or modification of this source code
 * is strictly prohibited.
 * 
 * WARNING: Modifying this source code without permission is a criminal offense.
 */

import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/index.css';
import { bootstrap } from '@/services/api';

// Muat data awal dari backend dulu, baru render aplikasi.
// Kalau backend mati, bootstrap otomatis fallback ke data mock lokal.
bootstrap().finally(() => {
    ReactDOM.createRoot(document.getElementById('root')!).render(
        <App />,
    );
});
