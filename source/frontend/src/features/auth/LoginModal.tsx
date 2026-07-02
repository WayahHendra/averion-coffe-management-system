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

import { useState, useRef } from 'react';
import { X, Eye, EyeOff, User, Lock } from 'lucide-react';
import { apiService } from '@/services/api';
import { getImageUrl } from '@/utils/image';

import type { User as UserType } from '@/core/types';

type UserData = UserType;

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLogin: (user: UserData, permissions: string[]) => void;
}

const LoginModal = ({ isOpen, onClose, onLogin }: LoginModalProps) => {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const identifierInputRef = useRef<HTMLInputElement>(null);
    const passwordInputRef = useRef<HTMLInputElement>(null);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!identifier || !password) {
            setError('Please fill in all fields');
            return;
        }

        setIsLoading(true);

        try {
            const result = await apiService.login(identifier, password);
            console.log('Login result:', result);

            if (result.success && result.data) {
                onLogin(result.data, result.permissions);
                onClose();
                setIdentifier('');
                setPassword('');
            } else {
                setError(result.message || 'Invalid email or password');
            }
        } catch {
            setError('Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent, field: 'identifier' | 'password') => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (!identifier) {
                identifierInputRef.current?.focus();
            } else if (!password) {
                passwordInputRef.current?.focus();
            } else {
                handleSubmit(e as unknown as React.FormEvent);
            }
        } else if (e.key === 'ArrowDown') {
            if (field === 'identifier') {
                e.preventDefault();
                passwordInputRef.current?.focus();
            }
        } else if (e.key === 'ArrowUp') {
            if (field === 'password') {
                e.preventDefault();
                identifierInputRef.current?.focus();
            }
        }
    };

    return (
        <div className="login-modal-overlay">
            <div className="login-modal">
                {/* Close Button */}
                <button className="login-modal-close" onClick={onClose}>
                    <X size={20} />
                </button>

                {/* Left Side - Login Form */}
                <div className="login-form-section">
                    <div className="login-form-content">
                        {/* Logo & Title */}
                        <div className="login-header">
                            <div className="login-logo">
                                <img src="./base-icon.png" alt="Logo" />
                            </div>
                            <h2>Welcome Back</h2>
                            <p>Sign in to continue to Coffee Shop CMS</p>
                        </div>

                        {/* Login Form */}
                        <form onSubmit={handleSubmit} className="login-form">
                            {error && (
                                <div className="login-error">
                                    {error}
                                </div>
                            )}

                            <div className="login-input-group">
                                <label>Email or Username</label>
                                <div className="login-input-wrapper">
                                    <User size={16} className="login-input-icon" />
                                    <input
                                        ref={identifierInputRef}
                                        type="text"
                                        placeholder="Enter email or username"
                                        value={identifier}
                                        onChange={(e) => setIdentifier(e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(e, 'identifier')}
                                    />
                                </div>
                            </div>

                            <div className="login-input-group">
                                <label>Password</label>
                                <div className="login-input-wrapper">
                                    <Lock size={16} className="login-input-icon" />
                                    <input
                                        ref={passwordInputRef}
                                        type={showPassword ? 'text' : 'password'}
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        onKeyDown={(e) => handleKeyDown(e, 'password')}
                                    />
                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            <div className="login-options">
                                <label className="remember-me">
                                    <input type="checkbox" />
                                    <span>Remember me</span>
                                </label>
                            </div>

                            <button
                                type="submit"
                                className={`login-submit-btn ${isLoading ? 'loading' : ''}`}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <span className="login-spinner"></span>
                                ) : (
                                    'Sign In'
                                )}
                            </button>
                        </form>

                        <div className="login-footer">
                            <p>Don't have an account? <a href="#">Contact Admin</a></p>
                        </div>
                    </div>
                </div>

                {/* Right Side - Image */}
                <div className="login-image-section">
                    <div className="login-image-overlay"></div>
                    <img src={getImageUrl('./banners/login-banner.png') || ''} alt="Cafe Scene" />
                    <div className="login-image-content">
                        <h3>Coffee Shop CMS</h3>
                        <p>Manage your coffee shop with ease</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginModal;
