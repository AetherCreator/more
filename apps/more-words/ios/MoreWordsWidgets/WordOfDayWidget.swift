import WidgetKit
import SwiftUI

// MARK: - Timeline Provider

struct WordOfDayProvider: TimelineProvider {
    func placeholder(in context: Context) -> WordOfDayEntry {
        WordOfDayEntry(date: Date(), word: "luminous", pronunciation: "LOO-mih-nus",
                       definition: "Emitting or reflecting light", etymology: nil)
    }

    func getSnapshot(in context: Context, completion: @escaping (WordOfDayEntry) -> Void) {
        let entry = makeEntry()
        completion(entry)
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<WordOfDayEntry>) -> Void) {
        let entry = makeEntry()
        // Refresh at midnight
        let tomorrow = Calendar.current.startOfDay(for: Date()).addingTimeInterval(86400)
        let timeline = Timeline(entries: [entry], policy: .after(tomorrow))
        completion(timeline)
    }

    private func makeEntry() -> WordOfDayEntry {
        if let word = SharedDB.getWordOfDay() {
            return WordOfDayEntry(date: Date(), word: word.word,
                                  pronunciation: word.pronunciation,
                                  definition: word.definition,
                                  etymology: word.etymology)
        }
        return WordOfDayEntry(date: Date(), word: "luminous",
                              pronunciation: "LOO-mih-nus",
                              definition: "Emitting or reflecting light",
                              etymology: nil)
    }
}

// MARK: - Entry

struct WordOfDayEntry: TimelineEntry {
    let date: Date
    let word: String
    let pronunciation: String?
    let definition: String
    let etymology: String?
}

// MARK: - Views

struct WordOfDayWidgetEntryView: View {
    var entry: WordOfDayEntry
    @Environment(\.widgetFamily) var family

    var body: some View {
        ZStack {
            Color(red: 0.051, green: 0.051, blue: 0.059) // #0d0d0f
            VStack(alignment: .leading, spacing: 4) {
                Text("WORD OF THE DAY")
                    .font(.system(size: 9, weight: .semibold))
                    .foregroundColor(Color(red: 0.788, green: 0.659, blue: 0.298)) // #c9a84c
                    .tracking(1.5)

                Text(entry.word)
                    .font(.system(family == .systemSmall ? .title3 : .title, design: .serif))
                    .fontWeight(.bold)
                    .foregroundColor(Color(red: 0.961, green: 0.941, blue: 0.910)) // #f5f0e8

                if family != .systemSmall {
                    if let pronunciation = entry.pronunciation {
                        Text(pronunciation)
                            .font(.system(size: 11))
                            .foregroundColor(.gray)
                    }
                    Text(entry.definition)
                        .font(.system(size: family == .systemLarge ? 15 : 13))
                        .foregroundColor(Color(red: 0.541, green: 0.541, blue: 0.541))
                        .lineLimit(family == .systemLarge ? 4 : 2)
                }

                if family == .systemLarge, let etymology = entry.etymology {
                    Spacer()
                    Text(etymology)
                        .font(.system(size: 12, design: .serif))
                        .italic()
                        .foregroundColor(.gray)
                        .lineLimit(2)
                }
            }
            .padding()
        }
        .widgetURL(URL(string: "morewords://feed"))
    }
}

// MARK: - Widget

struct WordOfDayWidget: Widget {
    let kind = "WordOfDayWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: WordOfDayProvider()) { entry in
            WordOfDayWidgetEntryView(entry: entry)
        }
        .configurationDisplayName("Word of the Day")
        .description("Today's featured word from MoreWords")
        .supportedFamilies([.systemSmall, .systemMedium, .systemLarge])
    }
}
