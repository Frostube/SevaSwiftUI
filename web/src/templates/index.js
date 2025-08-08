// SwiftUI Templates for the Web Previewer
// These templates demonstrate various SwiftUI patterns and components

export const templates = {
  hello: {
    name: "Hello VStack",
    description: "Basic VStack with text and button",
    code: `import SwiftUI

struct ContentView: View {
    var body: some View {
        VStack(spacing: 20) {
            Text("Hello, SwiftUI!")
                .font(.title)
                .foregroundColor(.primary)
            
            Text("Welcome to the web preview")
                .font(.body)
                .foregroundColor(.secondary)
            
            Button("Tap me!") {
                print("Button tapped")
            }
            .padding()
            .background(Color.blue)
            .foregroundColor(.white)
            .cornerRadius(8)
        }
        .padding()
    }
}`
  },

  list: {
    name: "List View",
    description: "Simple list with navigation",
    code: `import SwiftUI

struct ContentView: View {
    let items = ["Apple", "Banana", "Cherry", "Date", "Elderberry"]
    
    var body: some View {
        NavigationView {
            List(items, id: \\.self) { item in
                HStack {
                    Image(systemName: "star.fill")
                        .foregroundColor(.yellow)
                    Text(item)
                        .font(.body)
                    Spacer()
                    Text("Detail")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
                .padding(.vertical, 4)
            }
            .navigationTitle("Fruits")
        }
    }
}`
  },

  navigation: {
    name: "Navigation",
    description: "Multi-screen navigation flow",
    code: `import SwiftUI

struct ContentView: View {
    var body: some View {
        NavigationView {
            VStack(spacing: 20) {
                NavigationLink("Go to Detail") {
                    DetailView()
                }
                .padding()
                .background(Color.blue)
                .foregroundColor(.white)
                .cornerRadius(8)
                
                NavigationLink("Go to Settings") {
                    SettingsView()
                }
                .padding()
                .background(Color.green)
                .foregroundColor(.white)
                .cornerRadius(8)
            }
            .navigationTitle("Home")
            .padding()
        }
    }
}

struct DetailView: View {
    var body: some View {
        VStack(spacing: 20) {
            Text("Detail View")
                .font(.title)
            
            Text("This is a detail view with some content.")
                .font(.body)
                .foregroundColor(.secondary)
                .padding()
        }
        .navigationTitle("Detail")
    }
}

struct SettingsView: View {
    @State private var notificationsEnabled = true
    @State private var selectedTheme = 0
    
    let themes = ["Light", "Dark", "Auto"]
    
    var body: some View {
        Form {
            Section("Preferences") {
                Toggle("Enable Notifications", isOn: $notificationsEnabled)
                
                Picker("Theme", selection: $selectedTheme) {
                    ForEach(0..<themes.count, id: \\.self) { index in
                        Text(themes[index]).tag(index)
                    }
                }
            }
        }
        .navigationTitle("Settings")
    }
}`
  },

  cards: {
    name: "Cards",
    description: "Card-based layouts",
    code: `import SwiftUI

struct ContentView: View {
    var body: some View {
        ScrollView {
            LazyVStack(spacing: 16) {
                ForEach(0..<5) { index in
                    CardView(
                        title: "Card \\(index + 1)",
                        subtitle: "Subtitle for card \\(index + 1)",
                        imageName: "photo"
                    )
                }
            }
            .padding()
        }
        .navigationTitle("Cards")
    }
}

struct CardView: View {
    let title: String
    let subtitle: String
    let imageName: String
    
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            // Header
            HStack {
                Image(systemName: imageName)
                    .frame(width: 40, height: 40)
                    .background(Color.blue.opacity(0.1))
                    .cornerRadius(8)
                
                VStack(alignment: .leading) {
                    Text(title)
                        .font(.headline)
                        .foregroundColor(.primary)
                    
                    Text(subtitle)
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
                
                Spacer()
                
                Button(action: {}) {
                    Image(systemName: "ellipsis")
                        .foregroundColor(.secondary)
                }
            }
            
            // Content
            Text("This is sample content for the card. It could be a description, article preview, or any other information.")
                .font(.body)
                .foregroundColor(.secondary)
                .lineLimit(3)
            
            // Footer
            HStack {
                Button("View Details") {
                    print("\\(title) details tapped")
                }
                .font(.caption)
                .padding(.horizontal, 12)
                .padding(.vertical, 6)
                .background(Color.blue)
                .foregroundColor(.white)
                .cornerRadius(6)
                
                Spacer()
                
                HStack(spacing: 4) {
                    Image(systemName: "clock")
                        .font(.caption)
                    Text("2 min ago")
                        .font(.caption)
                }
                .foregroundColor(.secondary)
            }
        }
        .padding()
        .background(Color(.systemGray6))
        .cornerRadius(12)
        .shadow(color: .black.opacity(0.1), radius: 2, x: 0, y: 1)
    }
}`
  },

  forms: {
    name: "Forms",
    description: "Form inputs and validation",
    code: `import SwiftUI

struct ContentView: View {
    @State private var name = ""
    @State private var email = ""
    @State private var password = ""
    @State private var confirmPassword = ""
    @State private var isSubscribed = false
    @State private var selectedCountry = 0
    @State private var birthDate = Date()
    @State private var agreedToTerms = false
    
    let countries = ["United States", "Canada", "United Kingdom", "Germany", "France"]
    
    var isFormValid: Bool {
        !name.isEmpty && 
        !email.isEmpty && 
        !password.isEmpty && 
        password == confirmPassword &&
        agreedToTerms
    }
    
    var body: some View {
        NavigationView {
            Form {
                Section("Personal Information") {
                    TextField("Full Name", text: $name)
                        .textContentType(.name)
                    
                    TextField("Email", text: $email)
                        .keyboardType(.emailAddress)
                        .textContentType(.emailAddress)
                        .autocapitalization(.none)
                    
                    DatePicker("Birth Date", selection: $birthDate, displayedComponents: .date)
                    
                    Picker("Country", selection: $selectedCountry) {
                        ForEach(0..<countries.count, id: \\.self) { index in
                            Text(countries[index]).tag(index)
                        }
                    }
                }
                
                Section("Account Security") {
                    SecureField("Password", text: $password)
                        .textContentType(.newPassword)
                    
                    SecureField("Confirm Password", text: $confirmPassword)
                        .textContentType(.newPassword)
                    
                    if !password.isEmpty && password != confirmPassword {
                        Text("Passwords do not match")
                            .foregroundColor(.red)
                            .font(.caption)
                    }
                }
                
                Section("Preferences") {
                    Toggle("Subscribe to newsletter", isOn: $isSubscribed)
                    
                    Toggle("I agree to the Terms of Service", isOn: $agreedToTerms)
                }
                
                Section {
                    Button("Create Account") {
                        print("Account creation attempted")
                        print("Name: \\(name)")
                        print("Email: \\(email)")
                        print("Country: \\(countries[selectedCountry])")
                        print("Newsletter: \\(isSubscribed)")
                    }
                    .frame(maxWidth: .infinity)
                    .disabled(!isFormValid)
                    
                    Button("Reset Form") {
                        name = ""
                        email = ""
                        password = ""
                        confirmPassword = ""
                        isSubscribed = false
                        selectedCountry = 0
                        birthDate = Date()
                        agreedToTerms = false
                    }
                    .foregroundColor(.red)
                    .frame(maxWidth: .infinity)
                }
            }
            .navigationTitle("Sign Up")
        }
    }
}`
  },

  animations: {
    name: "Animations",
    description: "Basic animations and transitions",
    code: `import SwiftUI

struct ContentView: View {
    @State private var isAnimated = false
    @State private var rotation = 0.0
    @State private var scale = 1.0
    @State private var opacity = 1.0
    
    var body: some View {
        VStack(spacing: 30) {
            Text("SwiftUI Animations")
                .font(.title)
                .padding()
            
            // Scale Animation
            Button("Scale Animation") {
                withAnimation(.easeInOut(duration: 0.5)) {
                    scale = scale == 1.0 ? 1.5 : 1.0
                }
            }
            .scaleEffect(scale)
            .padding()
            .background(Color.blue)
            .foregroundColor(.white)
            .cornerRadius(8)
            
            // Rotation Animation
            Button("Rotate") {
                withAnimation(.easeInOut(duration: 0.5)) {
                    rotation += 180
                }
            }
            .rotationEffect(.degrees(rotation))
            .padding()
            .background(Color.green)
            .foregroundColor(.white)
            .cornerRadius(8)
            
            // Opacity Animation
            Button("Fade") {
                withAnimation(.easeInOut(duration: 0.5)) {
                    opacity = opacity == 1.0 ? 0.3 : 1.0
                }
            }
            .opacity(opacity)
            .padding()
            .background(Color.orange)
            .foregroundColor(.white)
            .cornerRadius(8)
            
            // Combined Animation
            VStack {
                Rectangle()
                    .fill(Color.purple)
                    .frame(width: isAnimated ? 100 : 200, height: 100)
                    .cornerRadius(isAnimated ? 50 : 10)
                    .animation(.spring(response: 0.5, dampingFraction: 0.8), value: isAnimated)
                
                Button("Combined Animation") {
                    isAnimated.toggle()
                }
                .padding()
            }
            
            Spacer()
        }
        .padding()
    }
}`
  },

  weather: {
    name: "Weather App",
    description: "Weather app layout example",
    code: `import SwiftUI

struct ContentView: View {
    @State private var currentTemp = 72
    @State private var selectedDay = 0
    
    let weekDays = ["Today", "Tomorrow", "Wed", "Thu", "Fri", "Sat", "Sun"]
    let temperatures = [72, 75, 68, 71, 73, 69, 74]
    let conditions = ["Sunny", "Partly Cloudy", "Rainy", "Sunny", "Cloudy", "Rainy", "Sunny"]
    
    var body: some View {
        VStack(spacing: 0) {
            // Header
            VStack(spacing: 8) {
                Text("San Francisco")
                    .font(.title2)
                    .foregroundColor(.white)
                
                Text("\\(temperatures[selectedDay])°")
                    .font(.system(size: 72, weight: .thin))
                    .foregroundColor(.white)
                
                Text(conditions[selectedDay])
                    .font(.title3)
                    .foregroundColor(.white.opacity(0.8))
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, 40)
            .background(
                LinearGradient(
                    colors: [.blue, .cyan],
                    startPoint: .topLeading,
                    endPoint: .bottomTrailing
                )
            )
            
            // 7-Day Forecast
            VStack(alignment: .leading, spacing: 0) {
                Text("7-Day Forecast")
                    .font(.headline)
                    .padding(.horizontal)
                    .padding(.top)
                
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 16) {
                        ForEach(0..<weekDays.count, id: \\.self) { index in
                            WeatherDayView(
                                day: weekDays[index],
                                temperature: temperatures[index],
                                condition: conditions[index],
                                isSelected: selectedDay == index
                            )
                            .onTapGesture {
                                selectedDay = index
                            }
                        }
                    }
                    .padding(.horizontal)
                }
                .padding(.vertical)
            }
            .background(Color(.systemBackground))
            
            // Hourly Forecast
            VStack(alignment: .leading, spacing: 0) {
                Text("Hourly Forecast")
                    .font(.headline)
                    .padding(.horizontal)
                    .padding(.top)
                
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 20) {
                        ForEach(0..<24, id: \\.self) { hour in
                            VStack(spacing: 8) {
                                Text("\\(hour):00")
                                    .font(.caption)
                                    .foregroundColor(.secondary)
                                
                                Image(systemName: hour % 3 == 0 ? "sun.max.fill" : "cloud.fill")
                                    .foregroundColor(hour % 3 == 0 ? .yellow : .gray)
                                
                                Text("\\(temperatures[selectedDay] + Int.random(in: -5...5))°")
                                    .font(.caption)
                                    .bold()
                            }
                            .padding(.vertical, 8)
                            .frame(width: 50)
                        }
                    }
                    .padding(.horizontal)
                }
                .padding(.bottom)
            }
            .background(Color(.systemBackground))
            
            Spacer()
        }
        .ignoresSafeArea(edges: .top)
    }
}

struct WeatherDayView: View {
    let day: String
    let temperature: Int
    let condition: String
    let isSelected: Bool
    
    var body: some View {
        VStack(spacing: 8) {
            Text(day)
                .font(.caption)
                .foregroundColor(isSelected ? .primary : .secondary)
            
            Image(systemName: iconName)
                .foregroundColor(iconColor)
                .font(.title2)
            
            Text("\\(temperature)°")
                .font(.caption)
                .bold()
                .foregroundColor(isSelected ? .primary : .secondary)
        }
        .padding()
        .background(isSelected ? Color.blue.opacity(0.1) : Color.clear)
        .cornerRadius(8)
    }
    
    private var iconName: String {
        switch condition {
        case "Sunny": return "sun.max.fill"
        case "Partly Cloudy": return "cloud.sun.fill"
        case "Cloudy": return "cloud.fill"
        case "Rainy": return "cloud.rain.fill"
        default: return "sun.max.fill"
        }
    }
    
    private var iconColor: Color {
        switch condition {
        case "Sunny": return .yellow
        case "Partly Cloudy": return .orange
        case "Cloudy": return .gray
        case "Rainy": return .blue
        default: return .yellow
        }
    }
}`
  }
};

export function getTemplate(name) {
  return templates[name] || templates.hello;
}

export function getAllTemplates() {
  return Object.values(templates);
}
