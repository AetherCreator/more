import WidgetKit
import SwiftUI

// MARK: - Timeline Provider

struct MyWordsProvider: TimelineProvider {
    func placeholder(in context: Context) -> MyWordsEntry {
        MyWordsEntry(date: Date(), word: "ephemeral", definition: "Lasting for a very short time", deckCount: 12)
    }

    func getSnapshot(in context: Context, completion: @escaping (MyWordsEntry) -> Void) {
        completion(makeEntry())
    }

    func getTimeline(in context: Context, completion: @escaping (Timeline<MyWordsEntry>) -> Void) {
        // Generate 12 entries (one every 2 hours for 24h)
        var entries: [MyWordsEntry] = []
        let now = Date()
        let deckCount = SharedDB.getDeckCount()

        for i in 0..<12 {
            let entryDate = Calendar.current.date(byAdding: .hour, value: i * 2, to: now)!
            let word = SharedDB.getDeckWord()
            entries.append(MyWordsEntry(
                date: entryDate,
                word: word?.word ?? "Save words to see them here",
                definition: word?.definition ?? "",
                deckCount: deckCount
            ))
        }

        let timeline = Timeline(entries: entries, policy: .atEnd)
        completion(timeline)
    }

    private func makeEntry() -> MyWordsEntry {
        let deckCount = SharedDB.getDeckCount()
        let word = SharedDB.getDeckWord()
        return MyWordsEntry(
            date: Date(),
            word: word?.word ?? "Save words to see them here",
            definition: word?.definition ?? "",
            deckCount: deckCount
        )
    }
}

// MARK: - Entry

struct MyWordsEntry: TimelineEntry {
    let date: Date
    let word: String
    let definition: String
    let deckCount: Int
}

// MARK: - View

struct MyWordsWidgetEntryView: View {
    var entry: MyWordsEntry

    var body: some View {
        ZStack {
            Color(red: 0.051, green: 0.051, blue: 0.059)
            VStack(alignment: .leading, spacing: 6) {
                Text(entry.word)
                    .font(.system(.title3, design: .serif))
                    .fontWeight(.bold)
                    .foregroundColor(Color(red: 0.961, green: 0.941, blue: 0.910))

                if !entry.definition.isEmpty {
                    Text(entry.definition)
                        .font(.system(size: 13))
                        .foregroundColor(Color(red: 0.541, green: 0.541, blue: 0.541))
                        .lineLimit(2)
                }

                Spacer()

                Text("\(entry.deckCount) words in your deck")
                    .font(.system(size: 10, weight: .medium))
                    .foregroundColor(.gray)
            }
            .padding()
        }
        .widgetURL(URL(string: "morewords://deck"))
    }
}

// MARK: - Widget

struct MyWordsWidget: Widget {
    let kind = "MyWordsWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: MyWordsProvider()) { entry in
            MyWordsWidgetEntryView(entry: entry)
        }
        .configurationDisplayName("My Words")
        .description("Rotates through your saved words every 2 hours")
        .supportedFamilies([.systemMedium])
    }
}
