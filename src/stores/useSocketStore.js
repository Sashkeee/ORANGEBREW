import { create } from 'zustand'

const RECONNECT_DELAY = 3000
const WS_URL = (hostname = 'localhost') => `ws://${hostname}:1880/ws/brewery`

export const useSocketStore = create((set, get) => ({
  // Connection state
  connected: false,
  connecting: false,
  
  // Data state
  t1: 0,
  recipes: [],
  history: [],
  
  // Process state
  process: {
    active: false,
    step: -1,
    totalTime: 0,
    stepTime: 0,
    targetTemp: 0,
    power: 0,
    recipeName: '',
    recipePauses: [],
    pendingRecipe: null
  },
  
  // WebSocket reference
  ws: null,
  
  // Message handlers registry
  handlers: {
    update: null,
    recipes_list: null,
    process_update: null,
    history_list: null
  },
  
  // Set message handler
  setHandler: (type, handler) => {
    set(state => ({
      handlers: { ...state.handlers, [type]: handler }
    }))
  },
  
  // Send message to server
  send: (type, payload) => {
    const { ws } = get()
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type, payload }))
    }
  },
  
  // Connect to WebSocket
  connect: () => {
    const { connecting, ws } = get()
    
    // Don't reconnect if already connecting or connected
    if (connecting || (ws && ws.readyState === WebSocket.OPEN)) return
    
    set({ connecting: true })
    
    const hostname = window.location.hostname || 'localhost'
    const socket = new WebSocket(WS_URL(hostname))
    
    socket.onopen = () => {
      set({ connected: true, connecting: false, ws: socket })
      // Request initial data after connection
      setTimeout(() => {
        get().send('get_recipes', null)
        get().send('get_history', null)
      }, 300)
    }
    
    socket.onclose = () => {
      set({ connected: false, connecting: false, ws: null })
      // Schedule reconnection
      setTimeout(() => get().connect(), RECONNECT_DELAY)
    }
    
    socket.onerror = () => {
      // Error will trigger onclose
      console.error('WebSocket error')
    }
    
    socket.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data)
        get().handleMessage(msg)
      } catch (err) {
        console.error('Failed to parse message:', err)
      }
    }
    
    set({ ws: socket })
  },
  
  // Handle incoming messages - route by type
  handleMessage: (msg) => {
    const { handlers } = get()
    
    switch (msg.type) {
      case 'update':
        // Temperature update
        set(state => ({
          t1: msg.payload.t1 ?? state.t1,
          ...msg.payload
        }))
        handlers.update?.(msg.payload)
        break
        
      case 'recipes_list':
        // Recipes list update
        set({ recipes: msg.payload || [] })
        handlers.recipes_list?.(msg.payload)
        break
        
      case 'process_update':
        // Process status update (main feature!)
        set(state => ({
          process: { ...state.process, ...msg.payload }
        }))
        handlers.process_update?.(msg.payload)
        break
        
      case 'history_list':
        // History update
        set({ history: msg.payload || [] })
        handlers.history_list?.(msg.payload)
        break
        
      default:
        console.log('Unknown message type:', msg.type)
    }
  },
  
  // Disconnect
  disconnect: () => {
    const { ws } = get()
    if (ws) {
      ws.close()
      set({ ws: null, connected: false })
    }
  }
}))

export default useSocketStore
