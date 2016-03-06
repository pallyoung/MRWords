//
//  CollectionViewCell.h
//  Words
//
//  Created by YeSpencer on 1/14/16.
//  Copyright © 2016 YeSpencer. All rights reserved.
//

#import <UIKit/UIKit.h>

@interface CollectionViewCell : UICollectionViewCell
@property (weak, nonatomic) IBOutlet UIImageView *imageView;
@property (weak, nonatomic) IBOutlet UILabel *label;
@property (weak, nonatomic) IBOutlet UIButton *checkBox;
@end
