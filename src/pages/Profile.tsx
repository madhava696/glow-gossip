import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Bot, Mail, Calendar, MessageSquare, LogOut, ArrowLeft } from 'lucide-react';

const Profile = () => {
  const { user, isGuest, guestMessageCount, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col relative overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5 pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none" />

      <div className="relative flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          {/* Back Button */}
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => navigate('/')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Chat
          </Button>

          <div className="glass-effect rounded-2xl border border-border/50 p-8 shadow-2xl">
            {/* Profile Header */}
            <div className="flex flex-col items-center mb-8">
              <div className="w-20 h-20 rounded-2xl bg-primary/20 border border-primary/50 flex items-center justify-center glow-primary mb-4">
                <Bot className="w-10 h-10 text-primary" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {isGuest ? 'Guest Profile' : 'Your Profile'}
              </h1>
              <p className="text-sm text-muted-foreground mt-2">
                {isGuest ? 'Limited access mode' : 'Full access account'}
              </p>
            </div>

            {/* Profile Info */}
            <div className="space-y-6">
              {isGuest ? (
                <>
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-background/50 border border-border/50">
                    <MessageSquare className="w-5 h-5 text-primary mt-0.5" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">Messages Used</h3>
                      <p className="text-sm text-muted-foreground">
                        {guestMessageCount} / 20 messages
                      </p>
                      <div className="w-full bg-border/30 rounded-full h-2 mt-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${(guestMessageCount / 20) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-accent/10 border border-accent/30">
                    <p className="text-sm text-foreground/80">
                      Create an account to get unlimited access and save your chat history across devices.
                    </p>
                    <Button
                      className="w-full mt-4"
                      onClick={() => navigate('/register')}
                    >
                      Create Account
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-start gap-4 p-4 rounded-xl bg-background/50 border border-border/50">
                    <Mail className="w-5 h-5 text-primary mt-0.5" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">Email</h3>
                      <p className="text-sm text-muted-foreground">{user?.email}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-xl bg-background/50 border border-border/50">
                    <Calendar className="w-5 h-5 text-primary mt-0.5" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">Member Since</h3>
                      <p className="text-sm text-muted-foreground">
                        {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4 p-4 rounded-xl bg-background/50 border border-border/50">
                    <MessageSquare className="w-5 h-5 text-primary mt-0.5" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">Access Level</h3>
                      <p className="text-sm text-muted-foreground">Unlimited messages</p>
                    </div>
                  </div>
                </>
              )}

              {/* Privacy Notice */}
              <div className="p-4 rounded-xl bg-primary/10 border border-primary/30">
                <h3 className="font-semibold text-foreground mb-2">🔒 Privacy Notice</h3>
                <p className="text-sm text-muted-foreground">
                  All emotion data is stored locally on your device and never uploaded to any server.
                  Your privacy is our top priority.
                </p>
              </div>

              {/* Logout Button */}
              <Button
                variant="outline"
                className="w-full"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4 mr-2" />
                {isGuest ? 'Exit Guest Mode' : 'Sign Out'}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
