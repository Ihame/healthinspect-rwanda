"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/lib/supabase"
import { Bell, Check, Trash2, AlertCircle, Info, CheckCircle, XCircle } from "lucide-react"

interface Notification {
  id: string
  title: string
  message: string
  type: "info" | "warning" | "error" | "success"
  is_read: boolean
  action_url?: string
  created_at: string
}

export default function NotificationsPage() {
  const { userProfile } = useAuth()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchNotifications()
  }, [userProfile])

  const fetchNotifications = async () => {
    if (!userProfile) return

    try {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", userProfile.id)
        .order("created_at", { ascending: false })

      if (error) throw error
      setNotifications(data || [])
    } catch (error) {
      console.error("Error fetching notifications:", error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      const { error } = await supabase.from("notifications").update({ is_read: true }).eq("id", notificationId)

      if (error) throw error

      setNotifications(notifications.map((n) => (n.id === notificationId ? { ...n, is_read: true } : n)))
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  const markAllAsRead = async () => {
    try {
      const { error } = await supabase
        .from("notifications")
        .update({ is_read: true })
        .eq("user_id", userProfile?.id)
        .eq("is_read", false)

      if (error) throw error

      setNotifications(notifications.map((n) => ({ ...n, is_read: true })))
    } catch (error) {
      console.error("Error marking all notifications as read:", error)
    }
  }

  const deleteNotification = async (notificationId: string) => {
    try {
      const { error } = await supabase.from("notifications").delete().eq("id", notificationId)

      if (error) throw error

      setNotifications(notifications.filter((n) => n.id !== notificationId))
    } catch (error) {
      console.error("Error deleting notification:", error)
    }
  }

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case "error":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <Info className="h-5 w-5 text-blue-500" />
    }
  }

  const getNotificationBadgeColor = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-100 text-green-800"
      case "warning":
        return "bg-yellow-100 text-yellow-800"
      case "error":
        return "bg-red-100 text-red-800"
      default:
        return "bg-blue-100 text-blue-800"
    }
  }

  const unreadCount = notifications.filter((n) => !n.is_read).length

  if (loading) {
    return (
      <MainLayout>
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded"></div>
            ))}
          </div>
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
              <Bell className="h-6 w-6 mr-2" />
              Notifications
              {unreadCount > 0 && <Badge className="ml-2 bg-red-500 text-white">{unreadCount}</Badge>}
            </h1>
            <p className="text-gray-600">Stay updated with system notifications and alerts</p>
          </div>
          {unreadCount > 0 && (
            <Button onClick={markAllAsRead} variant="outline">
              <Check className="h-4 w-4 mr-2" />
              Mark All as Read
            </Button>
          )}
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {notifications.map((notification) => (
            <Card
              key={notification.id}
              className={`transition-all ${!notification.is_read ? "border-l-4 border-l-blue-500 bg-blue-50/30" : ""}`}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className={`font-medium ${!notification.is_read ? "font-semibold" : ""}`}>
                          {notification.title}
                        </h3>
                        <Badge className={getNotificationBadgeColor(notification.type)}>{notification.type}</Badge>
                        {!notification.is_read && (
                          <Badge variant="secondary" className="text-xs">
                            New
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm mb-2">{notification.message}</p>
                      <p className="text-xs text-gray-400">{new Date(notification.created_at).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {!notification.is_read && (
                      <Button variant="outline" size="sm" onClick={() => markAsRead(notification.id)}>
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    <Button variant="outline" size="sm" onClick={() => deleteNotification(notification.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                {notification.action_url && (
                  <div className="mt-3">
                    <Button asChild size="sm" className="bg-[#4CAF50] hover:bg-[#45a049]">
                      <a href={notification.action_url}>Take Action</a>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}

          {notifications.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
                <p className="text-gray-600">You're all caught up! No new notifications at this time.</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Summary Card */}
        {notifications.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Notification Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{notifications.length}</div>
                  <div className="text-sm text-gray-600">Total</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{unreadCount}</div>
                  <div className="text-sm text-gray-600">Unread</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {notifications.filter((n) => n.type === "success").length}
                  </div>
                  <div className="text-sm text-gray-600">Success</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">
                    {notifications.filter((n) => n.type === "error" || n.type === "warning").length}
                  </div>
                  <div className="text-sm text-gray-600">Alerts</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  )
}
