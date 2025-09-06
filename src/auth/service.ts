import { User, SavedProperty } from './types';

const USERS_KEY = 'rental_analyzer_users';
const CURRENT_USER_KEY = 'rental_analyzer_current_user';
const PROPERTIES_KEY = 'rental_analyzer_properties';

// Simple local storage auth service
export class AuthService {
  static getUsers(): User[] {
    const users = localStorage.getItem(USERS_KEY);
    return users ? JSON.parse(users) : [];
  }

  static saveUsers(users: User[]): void {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  static getCurrentUser(): User | null {
    const user = localStorage.getItem(CURRENT_USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  static setCurrentUser(user: User | null): void {
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  }

  static signUp(email: string): User {
    const users = this.getUsers();
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    const newUser: User = {
      email,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    this.saveUsers(users);
    this.setCurrentUser(newUser);
    return newUser;
  }

  static signIn(email: string): User {
    const users = this.getUsers();
    const user = users.find(u => u.email === email);
    if (!user) {
      throw new Error('User not found');
    }
    this.setCurrentUser(user);
    return user;
  }

  static signOut(): void {
    this.setCurrentUser(null);
  }
}

// Property storage service
export class PropertyService {
  static getProperties(userId: string): SavedProperty[] {
    const properties = localStorage.getItem(PROPERTIES_KEY);
    const allProperties: SavedProperty[] = properties ? JSON.parse(properties) : [];
    return allProperties.filter(p => p.userId === userId);
  }

  static saveProperty(property: Omit<SavedProperty, 'id' | 'createdAt' | 'updatedAt'>): SavedProperty {
    const properties = localStorage.getItem(PROPERTIES_KEY);
    const allProperties: SavedProperty[] = properties ? JSON.parse(properties) : [];
    
    const newProperty: SavedProperty = {
      ...property,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    allProperties.push(newProperty);
    localStorage.setItem(PROPERTIES_KEY, JSON.stringify(allProperties));
    return newProperty;
  }

  static updateProperty(id: string, updates: Partial<SavedProperty>): SavedProperty {
    const properties = localStorage.getItem(PROPERTIES_KEY);
    const allProperties: SavedProperty[] = properties ? JSON.parse(properties) : [];
    
    const index = allProperties.findIndex(p => p.id === id);
    if (index === -1) {
      throw new Error('Property not found');
    }

    allProperties[index] = {
      ...allProperties[index],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    localStorage.setItem(PROPERTIES_KEY, JSON.stringify(allProperties));
    return allProperties[index];
  }

  static deleteProperty(id: string): void {
    const properties = localStorage.getItem(PROPERTIES_KEY);
    const allProperties: SavedProperty[] = properties ? JSON.parse(properties) : [];
    const filtered = allProperties.filter(p => p.id !== id);
    localStorage.setItem(PROPERTIES_KEY, JSON.stringify(filtered));
  }
}
