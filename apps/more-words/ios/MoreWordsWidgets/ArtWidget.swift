import WidgetKit
import SwiftUI

// MARK: - Theme Colors

struct ThemeColors {
    let background: Color
    let word: Color

    static let midnight = ThemeColors(
        background: Color(red: 0.051, green: 0.051, blue: 0.059),
        word: Color(red: 0.788, green: 0.659, blue: 0.298)
    )
    static let paper = ThemeColors(
        background: Color(red: 0.961, green: 0.941, blue: 0.910),
        word: Color(red: 0.102, green: 0.102, blue: 0.102)
    )
    static let bloom = ThemeColors(
        background: Color(red: 0.102, green: 0.039, blue: 0.180),
        word: Color(red: 0.753, green: 0.518, blue: 0.988)
    )

    static func forTheme(_ name: String) -> ThemeColors {
        switch name {
        case "paper": return .paper
        case "bloom": return .bloom
        default: return .midnight
        }
    }
}

// MARK: - Timeline Provider

struct ArtProvider: TimelineProvider {
    func placeholder(in context: Context) -> ArtEntry {
        ArtEntry(date: Date(), word: "luminous", theme: "midnight")
    }

    func getSnapshot(in context: Context, completion: @escaping (ArtEntry) -> Void) {
        completion(makeEntry())
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<ArtEntry>) -> Void) {
        let entry = makeEntry()
        let tomorrow = Calendar.current.startOfDay(for: Date()).addingTimeInterval(86400)
        let timeline = Timeline(entries: [entry], policy: .after(tomorrow))
        completion(timeline)
    }

    private func makeEntry() -> ArtEntry {
        let word = SharedDB.getWordOfDay()?.word ?? "luminous"
        let theme = SharedDB.getProfileTheme()
        return ArtEntry(date: Date(), word: word, theme: theme)
    }
}

// MARK: - Entry

struct ArtEntry: TimelineEntry {
    let date: Date
    let word: String
    let theme: String
}

// MARK: - View

struct ArtWidgetEntryView: View {
    var entry: ArtEntry
    @Environment(\.widgetFamily) var family

    var colors: ThemeColors {
        ThemeColors.forTheme(entry.theme)
    }

    var body: some View {
        ZStack {
            colors.background
            Text(entry.word)
                .font(.system(
                    size: family == .systemLarge ? 48 : 36,
                    weight: .bold,
                    design: .serif
                ))
                .foregroundColor(colors.word)
                .minimumScaleFactor(0.5)
                .lineLimit(1)
                .padding()
        }
        .widgetURL(URL(string: "morewords://feed"))
    }
}

// MARK: - Widget

struct ArtWidget: Widget {
    let kind = "ArtWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: ArtProvider()) { entry in
            ArtWidgetEntryView(entry: entry)
        }
        .configurationDisplayName("Art Widget")
        .description("Beautiful typography for your home screen")
        .supportedFamilies([.systemMedium, .systemLarge])
    }
}
