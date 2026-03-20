import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// 开发环境下的模拟登录
// 仅在开发环境中启用，用于绕过OAuth测试

export async function POST(request: Request) {
  // 检查环境
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: '禁止访问', message: '此接口仅在开发环境中可用' },
      { status: 403 }
    )
  }
  
  try {
    const body = await request.json()
    const { username = '测试用户' } = body
    
    // 创建模拟用户
    const mockUser = {
      id: 'dev-user-123',
      name: username,
      email: 'dev@example.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + username,
      interests: ['技术', 'AI', '开发'],
      expertise: ['前端开发', '后端开发', 'AI集成'],
    }
    
    // 设置模拟会话cookie
    const cookieStore = await cookies()
    cookieStore.set('dev-session', JSON.stringify(mockUser), {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24, // 24小时
      path: '/',
    })
    
    return NextResponse.json({
      success: true,
      message: '开发登录成功',
      user: mockUser,
      warning: '⚠️ 这是开发环境下的模拟登录，生产环境请使用Second Me OAuth',
      timestamp: new Date().toISOString(),
    })
    
  } catch (error) {
    console.error('开发登录错误:', error)
    return NextResponse.json(
      { error: '服务器错误', message: error instanceof Error ? error.message : '未知错误' },
      { status: 500 }
    )
  }
}

export async function DELETE() {
  // 检查环境
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: '禁止访问', message: '此接口仅在开发环境中可用' },
      { status: 403 }
    )
  }
  
  try {
    // 清除模拟会话
    const cookieStore = await cookies()
    cookieStore.delete('dev-session')
    
    return NextResponse.json({
      success: true,
      message: '开发登出成功',
      timestamp: new Date().toISOString(),
    })
    
  } catch (error) {
    console.error('开发登出错误:', error)
    return NextResponse.json(
      { error: '服务器错误', message: error instanceof Error ? error.message : '未知错误' },
      { status: 500 }
    )
  }
}

export async function GET() {
  // 检查环境
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: '禁止访问', message: '此接口仅在开发环境中可用' },
      { status: 403 }
    )
  }
  
  try {
    // 获取当前模拟会话
    const cookieStore = await cookies()
    const devSession = cookieStore.get('dev-session')
    
    if (!devSession) {
      return NextResponse.json({
        success: false,
        message: '未登录',
        user: null,
        timestamp: new Date().toISOString(),
      })
    }
    
    const user = JSON.parse(devSession.value)
    
    return NextResponse.json({
      success: true,
      message: '已登录',
      user,
      timestamp: new Date().toISOString(),
    })
    
  } catch (error) {
    console.error('获取开发会话错误:', error)
    return NextResponse.json(
      { error: '服务器错误', message: error instanceof Error ? error.message : '未知错误' },
      { status: 500 }
    )
  }
}