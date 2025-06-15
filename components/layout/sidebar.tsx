"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  Building2,
  ClipboardList,
  FileText,
  LogOut,
  Menu,
  X,
  Shield,
  Users,
  Settings,
  Bell,
  Plus,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth-context"
import { cn } from "@/lib/utils"

// Navigation items based on user roles
const getNavigationItems = (userRole: string) => {
  const baseItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: BarChart3,
      roles: ["super_admin", "pharmacy_supervisor", "hospital_supervisor", "pharmacy_inspector", "hospital_inspector"],
    },
  ]

  const adminItems = [
    {
      name: "User Management",
      href: "/admin/users",
      icon: Users,
      roles: ["super_admin", "pharmacy_supervisor", "hospital_supervisor"],
    },
    {
      name: "Facility Management",
      href: "/admin/facilities",
      icon: Building2,
      roles: ["super_admin", "pharmacy_supervisor", "hospital_supervisor"],
    },
    {
      name: "System Settings",
      href: "/admin/settings",
      icon: Settings,
      roles: ["super_admin"],
    },
  ]

  const inspectionItems = [
    {
      name: "Facilities",
      href: "/facilities",
      icon: Building2,
      roles: ["super_admin", "pharmacy_supervisor", "hospital_supervisor", "pharmacy_inspector", "hospital_inspector"],
    },
    {
      name: "New Inspection",
      href: "/inspection/new",
      icon: Plus,
      roles: ["pharmacy_inspector", "hospital_inspector"],
    },
    {
      name: "My Inspections",
      href: "/inspections",
      icon: ClipboardList,
      roles: ["pharmacy_inspector", "hospital_inspector"],
    },
    {
      name: "All Inspections",
      href: "/inspections/all",
      icon: ClipboardList,
      roles: ["super_admin", "pharmacy_supervisor", "hospital_supervisor"],
    },
  ]

  const reportItems = [
    {
      name: "Reports & Analytics",
      href: "/reports",
      icon: FileText,
      roles: ["super_admin", "pharmacy_supervisor", "hospital_supervisor", "pharmacy_inspector", "hospital_inspector"],
    },
  ]

  return [...baseItems, ...adminItems, ...inspectionItems, ...reportItems].filter((item) =>
    item.roles.includes(userRole),
  )
}

export function Sidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const { userProfile, signOut } = useAuth()

  if (!userProfile) return null

  const navigationItems = getNavigationItems(userProfile.role)

  return (
    <>
      {/* Mobile sidebar */}
      <div className={cn("fixed inset-0 z-50 lg:hidden", sidebarOpen ? "block" : "hidden")}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white shadow-xl">
          <SidebarContent
            navigationItems={navigationItems}
            pathname={pathname}
            userProfile={userProfile}
            signOut={signOut}
            onClose={() => setSidebarOpen(false)}
          />
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <SidebarContent
          navigationItems={navigationItems}
          pathname={pathname}
          userProfile={userProfile}
          signOut={signOut}
        />
      </div>

      {/* Mobile menu button */}
      <div className="lg:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setSidebarOpen(true)}
          className="fixed top-4 left-4 z-40 bg-white shadow-md"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </div>
    </>
  )
}

function SidebarContent({
  navigationItems,
  pathname,
  userProfile,
  signOut,
  onClose,
}: {
  navigationItems: any[]
  pathname: string
  userProfile: any
  signOut: () => void
  onClose?: () => void
}) {
  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case "super_admin":
        return "Super Admin"
      case "pharmacy_supervisor":
        return "Pharmacy Supervisor"
      case "hospital_supervisor":
        return "Hospital Supervisor"
      case "pharmacy_inspector":
        return "Pharmacy Inspector"
      case "hospital_inspector":
        return "Hospital Inspector"
      default:
        return role
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "super_admin":
        return "bg-purple-100 text-purple-800"
      case "pharmacy_supervisor":
        return "bg-blue-100 text-blue-800"
      case "hospital_supervisor":
        return "bg-green-100 text-green-800"
      case "pharmacy_inspector":
        return "bg-orange-100 text-orange-800"
      case "hospital_inspector":
        return "bg-teal-100 text-teal-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4 border-r border-gray-200">
      {/* Header */}
      <div className="flex h-16 shrink-0 items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="h-8 w-8 text-[#4CAF50]" />
          <div className="flex flex-col">
            <span className="text-lg font-bold text-gray-900">HealthInspect</span>
            <span className="text-xs text-gray-500">RSSB Rwanda</span>
          </div>
        </div>
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-6 w-6" />
          </Button>
        )}
      </div>

      {/* User Profile Section */}
      <div className="border-b border-gray-200 pb-4">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            <div className="h-10 w-10 rounded-full bg-[#4CAF50] flex items-center justify-center">
              <span className="text-white font-medium text-sm">
                {userProfile.name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")
                  .slice(0, 2)}
              </span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{userProfile.name}</p>
            <Badge className={cn("text-xs", getRoleBadgeColor(userProfile.role))}>
              {getRoleDisplayName(userProfile.role)}
            </Badge>
          </div>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          <p>District: {userProfile.district}</p>
          {userProfile.email && <p>Email: {userProfile.email}</p>}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col">
        <ul role="list" className="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" className="-mx-2 space-y-1">
              {navigationItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={(e) => {
                      // Don't prevent navigation, just close mobile sidebar
                      if (onClose) {
                        onClose()
                      }
                    }}
                    className={cn(
                      pathname === item.href
                        ? "bg-[#4CAF50] text-white shadow-sm"
                        : "text-gray-700 hover:text-[#4CAF50] hover:bg-gray-50",
                      "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-medium transition-colors",
                    )}
                  >
                    <item.icon
                      className={cn(
                        pathname === item.href ? "text-white" : "text-gray-400 group-hover:text-[#4CAF50]",
                        "h-6 w-6 shrink-0",
                      )}
                    />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </li>

          {/* Notifications */}
          <li className="mt-auto">
            <div className="border-t border-gray-200 pt-4">
              <Link
                href="/notifications"
                onClick={(e) => {
                  if (onClose) {
                    onClose()
                  }
                }}
                className="group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-medium text-gray-700 hover:text-[#4CAF50] hover:bg-gray-50"
              >
                <Bell className="h-6 w-6 shrink-0 text-gray-400 group-hover:text-[#4CAF50]" />
                Notifications
                <Badge variant="secondary" className="ml-auto">
                  3
                </Badge>
              </Link>
            </div>
          </li>

          {/* Sign Out */}
          <li>
            <Button
              variant="ghost"
              onClick={signOut}
              className="w-full justify-start text-gray-700 hover:text-red-600 hover:bg-red-50"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </li>
        </ul>
      </nav>
    </div>
  )
}
