import WidgetKit
import SwiftUI

// MARK: - Timeline Provider

struct StreakProvider: TimelineProvider {
    func placeholder(in context: Context) -> StreakEntry {
        StreakEntry(date: Date(), streak: 7, todayWord: "luminous")
    }

    func getSnapshot(in context: Context, completion: @escaping (StreakEntry) -> Void) {
        completion(makeEntry())
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<StreakEntry>) -> Void) {
        let entry = makeEntry()
        // Reload triggered by app via WidgetCenter.shared.reloadAllTimelines()
        let timeline = Timeline(entries: [entry], policy: .never)
        completion(timeline)
    }

    private func makeEntry() -> StreakEntry {
        let streak = SharedDB.getStreak()
        let word = SharedDB.getWordOfDay()?.word ?? "—"
        return StreakEntry(date: Date(), streak: streak, todayWord: word)
    }
}

// MARK: - Entry

struct StreakEntry: TimelineEntry {
    let date: Date
    let streak: Int
    let todayWord: String
}

// MARK: - View

struct StreakWidgetEntryView: View {
    var entry: StreakEntry

    var body: some View {
        ZStack {
            Color(red: 0.051, green: 0.051, blue: 0.059)
            VStack(spacing: 6) {
                Text("\(entry.streak)")
                    .font(.system(size: 40, weight: .bold, design: .rounded))
                    .foregroundColor(Color(red: 0.788, green: 0.659, blue: 0.298))

                Text("day streak")
                    .font(.system(size: 11, weight: .medium))
                    .foregroundColor(.gray)

                Spacer()

                Text(entry.todayWord)
                    .font(.system(size: 13, design: .serif))
                    .foregroundColor(Color(red: 0.961, green: 0.941, blue: 0.910))
            }
            .padding()
        }
        .widgetURL(URL(string: "morewords://feed"))
    }
}

// MARK: - Widget

struct StreakWidget: Widget {
    let kind = "StreakWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: StreakProvider()) { entry in
            StreakWidgetEntryView(entry: entry)
        }
        .configurationDisplayName("Streak")
        .description("Your current word streak")
        .supportedFamilies([.systemSmall])
    }
}
