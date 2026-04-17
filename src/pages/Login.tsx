import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Users, Eye, EyeOff, KeyRound } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { isPasswordStrong } from '@/lib/auth';
import { useTranslation } from 'react-i18next';

export default function Login() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Password reset states
  const [showResetDialog, setShowResetDialog] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);

  const { login, resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(email, password);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setError(result.error || 'Login failed');
    }

    setLoading(false);
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetLoading(true);
    setResetError('');

    // Validation
    if (!resetEmail) {
      setResetError(t('landing.login.errEmailRequired'));
      setResetLoading(false);
      return;
    }

    if (!newPassword) {
      setResetError(t('landing.login.errNewPasswordRequired'));
      setResetLoading(false);
      return;
    }

    if (!isPasswordStrong(newPassword)) {
      setResetError(t('landing.login.errPasswordRules'));
      setResetLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setResetError(t('landing.login.errPasswordsMismatch'));
      setResetLoading(false);
      return;
    }

    const result = await resetPassword(resetEmail, newPassword);

    if (result.success) {
      setResetSuccess(true);
      setResetError('');
      // Clear form
      setResetEmail('');
      setNewPassword('');
      setConfirmPassword('');
      // Close dialog after 2 seconds
      setTimeout(() => {
        setShowResetDialog(false);
        setResetSuccess(false);
      }, 2000);
    } else {
      setResetError(result.error || 'Password reset failed');
    }

    setResetLoading(false);
  };

  const openResetDialog = () => {
    setShowResetDialog(true);
    setResetEmail(email); // Pre-fill with login email if available
    setResetError('');
    setResetSuccess(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-stone-950 px-4 transition-colors duration-500">
      <Card className="w-full max-w-md dark:bg-stone-900 dark:border-stone-800">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-brand-500 text-black rounded-xl flex items-center justify-center">
              <Users className="w-8 h-8 text-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-neutral-900 dark:text-white">
            {t('landing.login.welcome')}
          </CardTitle>
          <CardDescription className="text-neutral-600 dark:text-stone-400">
            {t('landing.login.subtitle')}
          </CardDescription>
          <div className="mt-4">
            <Button
              variant="link"
              onClick={() => navigate('/landing')}
              className="text-sm text-brand-600 hover:text-brand-700"
            >
              {t('landing.login.learnMore')}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="dark:text-stone-300">{t('landing.login.email')}</Label>
              <Input
                id="email"
                type="email"
                placeholder={t('landing.login.emailPlaceholder')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="dark:bg-stone-950 dark:border-stone-800 dark:text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="dark:text-stone-300">{t('landing.login.password')}</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder={t('landing.login.passwordPlaceholder')}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                  className="dark:bg-stone-950 dark:border-stone-800 dark:text-white"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-brand-500 text-black hover:bg-brand-600"
              disabled={loading}
            >
              {loading ? t('landing.login.btnSigningIn') : t('landing.login.btnSignIn')}
            </Button>
          </form>

          <div className="mt-4 text-center">
            <Button
              variant="link"
              onClick={openResetDialog}
              className="text-sm text-neutral-600 dark:text-stone-400 hover:text-brand-600 dark:hover:text-brand-500"
              disabled={loading}
            >
              <KeyRound className="w-4 h-4 mr-2" />
              {t('landing.login.forgotPassword')}
            </Button>
          </div>

        </CardContent>
      </Card>

      {/* Password Reset Dialog */}
      <Dialog open={showResetDialog} onOpenChange={setShowResetDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <KeyRound className="w-5 h-5 text-brand-500" />
              {t('landing.login.resetTitle')}
            </DialogTitle>
            <DialogDescription>
              {t('landing.login.resetSubtitle')}
            </DialogDescription>
          </DialogHeader>

          {resetSuccess ? (
            <div className="py-6 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-green-800 mb-2">{t('landing.login.resetSuccessTitle')}</h3>
              <p className="text-sm text-green-600">{t('landing.login.resetSuccessMsg')}</p>
            </div>
          ) : (
            <form onSubmit={handleResetPassword} className="space-y-4">
              {resetError && (
                <Alert variant="destructive">
                  <AlertDescription>{resetError}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="resetEmail">{t('landing.login.email')}</Label>
                <Input
                  id="resetEmail"
                  type="email"
                  placeholder={t('landing.login.emailPlaceholder')}
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  required
                  disabled={resetLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">{t('landing.login.newPassword')}</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    placeholder={t('landing.login.newPasswordPlaceholder')}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    disabled={resetLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    disabled={resetLoading}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-neutral-500">
                  {t('landing.login.passwordRules')}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t('landing.login.confirmPassword')}</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder={t('landing.login.confirmPasswordPlaceholder')}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={resetLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={resetLoading}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <DialogFooter className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowResetDialog(false)}
                  disabled={resetLoading}
                >
                  {t('landing.login.btnCancel')}
                </Button>
                <Button
                  type="submit"
                  className="bg-brand-500 text-black hover:bg-brand-600"
                  disabled={resetLoading}
                >
                  {resetLoading ? t('landing.login.btnResetting') : t('landing.login.btnResetPassword')}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
