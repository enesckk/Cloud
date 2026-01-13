"use client"

import { useState, useEffect } from "react"
import { useTheme } from "next-themes"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Settings, Moon, Sun, Monitor } from "lucide-react"

export default function AdminSettingsPage() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Settings
          </CardTitle>
          <CardDescription>System configuration settings</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Theme Settings */}
          <div className="mb-6">
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-1">Appearance</h3>
              <p className="text-sm text-muted-foreground">Choose your preferred theme</p>
            </div>
            {mounted ? (
              <RadioGroup value={theme} onValueChange={setTheme} className="space-y-3">
                <div className="flex items-center space-x-2 rounded-lg border p-4 hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => setTheme("light")}>
                  <RadioGroupItem value="light" id="admin-light" />
                  <Label htmlFor="admin-light" className="flex-1 cursor-pointer flex items-center gap-3">
                    <Sun className="h-5 w-5 text-yellow-500" />
                    <div>
                      <div className="font-medium">Light</div>
                      <div className="text-sm text-muted-foreground">Use light theme</div>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 rounded-lg border p-4 hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => setTheme("dark")}>
                  <RadioGroupItem value="dark" id="admin-dark" />
                  <Label htmlFor="admin-dark" className="flex-1 cursor-pointer flex items-center gap-3">
                    <Moon className="h-5 w-5 text-blue-500" />
                    <div>
                      <div className="font-medium">Dark</div>
                      <div className="text-sm text-muted-foreground">Use dark theme</div>
                    </div>
                  </Label>
                </div>
                <div className="flex items-center space-x-2 rounded-lg border p-4 hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => setTheme("system")}>
                  <RadioGroupItem value="system" id="admin-system" />
                  <Label htmlFor="admin-system" className="flex-1 cursor-pointer flex items-center gap-3">
                    <Monitor className="h-5 w-5 text-gray-500" />
                    <div>
                      <div className="font-medium">System</div>
                      <div className="text-sm text-muted-foreground">Match your device theme</div>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            ) : (
              <div className="space-y-3">
                <div className="h-16 rounded-lg border bg-muted animate-pulse" />
                <div className="h-16 rounded-lg border bg-muted animate-pulse" />
                <div className="h-16 rounded-lg border bg-muted animate-pulse" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
