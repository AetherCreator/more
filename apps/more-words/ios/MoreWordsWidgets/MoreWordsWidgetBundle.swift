import WidgetKit
import SwiftUI

@main
struct MoreWordsWidgetBundle: WidgetBundle {
    var body: some Widget {
        WordOfDayWidget()
        StreakWidget()
        MyWordsWidget()
        ArtWidget()
    }
}
