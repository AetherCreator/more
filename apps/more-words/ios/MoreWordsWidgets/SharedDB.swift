import Foundation
import SQLite3

/// Shared database reader for WidgetKit extensions.
/// Reads from the App Group shared container where the main app writes.
struct SharedDB {
    static let appGroup = "group.com.more.morewords"
    static let dbName = "morewords.db"

    private static var dbPath: String {
        let containerURL = FileManager.default
            .containerURL(forSecurityApplicationGroupIdentifier: appGroup)!
        return containerURL.appendingPathComponent(dbName).path
    }

    /// Get Word of the Day — first word alphabetically by today's seed
    static func getWordOfDay() -> WidgetWord? {
        return queryWord(sql: """
            SELECT id, word, pronunciation, part_of_speech, definition, etymology
            FROM words ORDER BY RANDOM() LIMIT 1
        """)
    }

    /// Get a random saved word from the user's deck
    static func getDeckWord(profileId: Int = 1) -> WidgetWord? {
        return queryWord(sql: """
            SELECT w.id, w.word, w.pronunciation, w.part_of_speech, w.definition, w.etymology
            FROM saved_words sw JOIN words w ON w.id = sw.word_id
            WHERE sw.profile_id = \(profileId)
            ORDER BY RANDOM() LIMIT 1
        """)
    }

    /// Get current streak for a profile
    static func getStreak(profileId: Int = 1) -> Int {
        var db: OpaquePointer?
        guard sqlite3_open_v2(dbPath, &db, SQLITE_OPEN_READONLY, nil) == SQLITE_OK else {
            return 0
        }
        defer { sqlite3_close(db) }

        var stmt: OpaquePointer?
        let sql = "SELECT streak FROM profiles WHERE id = \(profileId)"
        guard sqlite3_prepare_v2(db, sql, -1, &stmt, nil) == SQLITE_OK else { return 0 }
        defer { sqlite3_finalize(stmt) }

        if sqlite3_step(stmt) == SQLITE_ROW {
            return Int(sqlite3_column_int(stmt, 0))
        }
        return 0
    }

    /// Get deck word count for a profile
    static func getDeckCount(profileId: Int = 1) -> Int {
        var db: OpaquePointer?
        guard sqlite3_open_v2(dbPath, &db, SQLITE_OPEN_READONLY, nil) == SQLITE_OK else {
            return 0
        }
        defer { sqlite3_close(db) }

        var stmt: OpaquePointer?
        let sql = "SELECT COUNT(*) FROM saved_words WHERE profile_id = \(profileId)"
        guard sqlite3_prepare_v2(db, sql, -1, &stmt, nil) == SQLITE_OK else { return 0 }
        defer { sqlite3_finalize(stmt) }

        if sqlite3_step(stmt) == SQLITE_ROW {
            return Int(sqlite3_column_int(stmt, 0))
        }
        return 0
    }

    /// Get the active profile's theme
    static func getProfileTheme(profileId: Int = 1) -> String {
        var db: OpaquePointer?
        guard sqlite3_open_v2(dbPath, &db, SQLITE_OPEN_READONLY, nil) == SQLITE_OK else {
            return "midnight"
        }
        defer { sqlite3_close(db) }

        var stmt: OpaquePointer?
        let sql = "SELECT theme FROM profiles WHERE id = \(profileId)"
        guard sqlite3_prepare_v2(db, sql, -1, &stmt, nil) == SQLITE_OK else { return "midnight" }
        defer { sqlite3_finalize(stmt) }

        if sqlite3_step(stmt) == SQLITE_ROW {
            return String(cString: sqlite3_column_text(stmt, 0))
        }
        return "midnight"
    }

    // MARK: - Private

    private static func queryWord(sql: String) -> WidgetWord? {
        var db: OpaquePointer?
        guard sqlite3_open_v2(dbPath, &db, SQLITE_OPEN_READONLY, nil) == SQLITE_OK else {
            return nil
        }
        defer { sqlite3_close(db) }

        var stmt: OpaquePointer?
        guard sqlite3_prepare_v2(db, sql, -1, &stmt, nil) == SQLITE_OK else { return nil }
        defer { sqlite3_finalize(stmt) }

        if sqlite3_step(stmt) == SQLITE_ROW {
            let id = Int(sqlite3_column_int(stmt, 0))
            let word = String(cString: sqlite3_column_text(stmt, 1))
            let pronunciation = sqlite3_column_text(stmt, 2).map { String(cString: $0) }
            let partOfSpeech = sqlite3_column_text(stmt, 3).map { String(cString: $0) }
            let definition = String(cString: sqlite3_column_text(stmt, 4))
            let etymology = sqlite3_column_text(stmt, 5).map { String(cString: $0) }

            return WidgetWord(
                id: id,
                word: word,
                pronunciation: pronunciation,
                partOfSpeech: partOfSpeech,
                definition: definition,
                etymology: etymology
            )
        }
        return nil
    }
}

struct WidgetWord {
    let id: Int
    let word: String
    let pronunciation: String?
    let partOfSpeech: String?
    let definition: String
    let etymology: String?
}
