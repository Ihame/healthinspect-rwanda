"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Settings, Save, Shield, Database, Bell } from "lucide-react"

export default function AdminSettingsPage() {
  const { userProfile } = useAuth()
  const router = useRouter()
  const [settings, setSettings] = useState({
    systemName: "HealthInspect Rwanda",
    organizationName: "Rwanda Social Security Board (RSSB)",
    supportEmail: "support@rssb.rw",
    enableNotifications: true,
    enableEmailAlerts: true,
    autoBackup: true,
    maintenanceMode: false,
    sessionTimeout: "30",
    maxLoginAttempts: "3",
    passwordMinLength: "8",
    systemMessage: "",
  })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (userProfile && userProfile.role !== "super_admin") {
      router.push("/dashboard")
    }
  }, [userProfile, router])

  const handleSave = async () => {
    setSaving(true)

    // Simulate saving settings
    await new Promise((resolve) => setTimeout(resolve, 1000))

    alert("Settings saved successfully!")
    setSaving(false)
  }

  const handleReset = () => {
    if (confirm("Are you sure you want to reset all settings to default values?")) {
      setSettings({
        systemName: "HealthInspect Rwanda",
        organizationName: "Rwanda Social Security Board (RSSB)",
        supportEmail: "support@rssb.rw",
        enableNotifications: true,
        enableEmailAlerts: true,
        autoBackup: true,
        maintenanceMode: false,
        sessionTimeout: "30",
        maxLoginAttempts: "3",
        passwordMinLength: "8",
        systemMessage: "",
      })
    }
  }

  if (userProfile?.role !== "super_admin") {
    return (
      <MainLayout>
        <div className="text-center py-12">
          <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Access Denied</h3>
          <p className="text-gray-600">Only super administrators can access system settings.</p>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Settings className="h-6 w-6 mr-2" />
              System Settings
            </h1>
            <p className="text-gray-600">Configure system-wide settings and preferences</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleReset}>
              Reset to Default
            </Button>
            <Button onClick={handleSave} disabled={saving} className="bg-[#4CAF50] hover:bg-[#45a049]">
              <Save className="h-4 w-4 mr-2" />
              {saving ? "Saving..." : "Save Settings"}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* General Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2" />
                General Settings
              </CardTitle>
              <CardDescription>Basic system configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="systemName">System Name</Label>
                <Input
                  id="systemName"
                  value={settings.systemName}
                  onChange={(e) => setSettings({ ...settings, systemName: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="organizationName">Organization Name</Label>
                <Input
                  id="organizationName"
                  value={settings.organizationName}
                  onChange={(e) => setSettings({ ...settings, organizationName: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="supportEmail">Support Email</Label>
                <Input
                  id="supportEmail"
                  type="email"
                  value={settings.supportEmail}
                  onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="systemMessage">System Message</Label>
                <Textarea
                  id="systemMessage"
                  placeholder="Optional message to display to all users"
                  value={settings.systemMessage}
                  onChange={(e) => setSettings({ ...settings, systemMessage: e.target.value })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                Security Settings
              </CardTitle>
              <CardDescription>Authentication and security configuration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                <Input
                  id="sessionTimeout"
                  type="number"
                  value={settings.sessionTimeout}
                  onChange={(e) => setSettings({ ...settings, sessionTimeout: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="maxLoginAttempts">Max Login Attempts</Label>
                <Input
                  id="maxLoginAttempts"
                  type="number"
                  value={settings.maxLoginAttempts}
                  onChange={(e) => setSettings({ ...settings, maxLoginAttempts: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="passwordMinLength">Minimum Password Length</Label>
                <Input
                  id="passwordMinLength"
                  type="number"
                  value={settings.passwordMinLength}
                  onChange={(e) => setSettings({ ...settings, passwordMinLength: e.target.value })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                  <p className="text-sm text-gray-500">Restrict access to administrators only</p>
                </div>
                <Switch
                  id="maintenanceMode"
                  checked={settings.maintenanceMode}
                  onCheckedChange={(checked) => setSettings({ ...settings, maintenanceMode: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Bell className="h-5 w-5 mr-2" />
                Notification Settings
              </CardTitle>
              <CardDescription>Configure system notifications and alerts</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enableNotifications">Enable Notifications</Label>
                  <p className="text-sm text-gray-500">Allow in-app notifications</p>
                </div>
                <Switch
                  id="enableNotifications"
                  checked={settings.enableNotifications}
                  onCheckedChange={(checked) => setSettings({ ...settings, enableNotifications: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="enableEmailAlerts">Email Alerts</Label>
                  <p className="text-sm text-gray-500">Send email notifications for critical events</p>
                </div>
                <Switch
                  id="enableEmailAlerts"
                  checked={settings.enableEmailAlerts}
                  onCheckedChange={(checked) => setSettings({ ...settings, enableEmailAlerts: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* System Maintenance */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Database className="h-5 w-5 mr-2" />
                System Maintenance
              </CardTitle>
              <CardDescription>Database and system maintenance options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="autoBackup">Automatic Backup</Label>
                  <p className="text-sm text-gray-500">Enable daily automatic database backups</p>
                </div>
                <Switch
                  id="autoBackup"
                  checked={settings.autoBackup}
                  onCheckedChange={(checked) => setSettings({ ...settings, autoBackup: checked })}
                />
              </div>
              <div className="space-y-2">
                <Button variant="outline" className="w-full">
                  <Database className="h-4 w-4 mr-2" />
                  Create Manual Backup
                </Button>
                <Button variant="outline" className="w-full">
                  Clear System Cache
                </Button>
                <Button variant="outline" className="w-full">
                  Export System Logs
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Information */}
        <Card>
          <CardHeader>
            <CardTitle>System Information</CardTitle>
            <CardDescription>Current system status and information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-gray-900">v1.0.0</div>
                <div className="text-sm text-gray-600">System Version</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">Online</div>
                <div className="text-sm text-gray-600">System Status</div>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">99.9%</div>
                <div className="text-sm text-gray-600">Uptime</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
